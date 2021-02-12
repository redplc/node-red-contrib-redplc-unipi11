/**
 * Copyright 2021 Ocean (iot.redplc@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";

	const syslib = require('./lib/syslib.js');
	const sysmoduledi = syslib.LoadModule("rpi_gpio.node", true);
	const sysmoduledo = syslib.LoadModule("rpi_mcp23008.node");
	const sysmoduleai = syslib.LoadModule("rpi_mcp342x.node");

	const DI_MODE_INPUT_PULLU = 3;
	const DO_MODE_OUTPUT = 2;
	const AI_MODE_DISABLED = 99;

    RED.nodes.registerType("unipi11", function(n) {
		var node = this;
		RED.nodes.createNode(node, n);

		node.disableai = n.disableai;
		node.mode0 = parseInt(n.mode0);
		node.mode1 = parseInt(n.mode1);
		node.factor0 = Number(n.factor0);
		node.factor1 = Number(n.factor1);
		node.offset0 = Number(n.offset0);
		node.offset1 = Number(n.offset1);

		node.tagnamedi = "I" + n.addressdi;
		node.tagnamedo = "Q" + n.addressdo;
		node.tagnameai = "IA" + n.addressai;
		node.name = "Unipi 1.1";
		
		node.iserror = false;
		node.iserrorInput = false;
		node.iserrorOutput = false;
		node.setai = false;
		node.setdi = false;
		node.setdo = false;

		node.store = node.context().global;

		node.statustxt = "";

		if ((sysmoduledi === undefined) || (sysmoduledo === undefined) || (sysmoduleai === undefined))
			node.iserror = syslib.outError(node, "sysmodules", "sysmodules not load");

		if (!node.iserror) {
			if (typeof node.store.keys().find(key => key == node.tagnamedi) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate " + node.tagnamedi, "duplicate address " + node.tagnamedi);
			else {
				node.store.set(node.tagnamedi, 0);
				node.statustxt += " " + node.tagnamedi;
				node.setdi = true;
			}
		}

		if (!node.iserror) {
			if (typeof node.store.keys().find(key => key == node.tagnamedo) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate " + node.tagnamedo, "duplicate address " + node.tagnamedo);
			else {
				node.store.set(node.tagnamedo, 0);
				node.statustxt += " " + node.tagnamedo;
				node.setdo = true;
			}
		}

		if (!node.iserror && !node.disableai) {
			if (typeof node.store.keys().find(key => key == node.tagnameai) !== "undefined")
				node.iserror = syslib.outError(node, "duplicate " + node.tagnameai, "duplicate address " + node.tagnameai);
			else {
				node.store.set(node.tagnameai, [0, 0]);
				node.statustxt += " " + node.tagnameai;
				node.setai = true;
			}
		}

		if (!node.iserror)
			if (sysmoduledo.inuse(0))
				node.iserror = syslib.outError(node, "in use", "Node in use " + node.name);

		if (!node.iserror) {
			sysmoduledi.initDIO();
			for (var i = 0; i < 12; i++)
				sysmoduledi.setModeDIO(syslib.getPin(i), DI_MODE_INPUT_PULLU);
		}

		if (!node.iserror) {
			if (!sysmoduledo.initDIO(0, DO_MODE_OUTPUT))
				node.iserror = syslib.outError(node, "init DO", "error on init DO");
		}

		if (!node.iserror && !node.disableai) {
			sysmoduleai.setmodeAI(0, node.mode0, node.mode1, AI_MODE_DISABLED, AI_MODE_DISABLED);
			sysmoduleai.setgainAI(0, 0, 0, 0, 0);
			if (!sysmoduleai.initAI(0))
				node.iserror = syslib.outError(node, "init AI", "error on init AI");
		}

		if (!node.iserror) {
			node.statustxt = node.statustxt.trim();
			syslib.setStatus(node, node.statustxt);
		}

		node.on("input", function (msg) {
			if (!node.iserror) {

				if (msg.payload === "input") {
					node.store.set(node.tagnamedi, syslib.shiftPins(sysmoduledi.updateDI()));

					if (!node.disableai) {
						var aival = sysmoduleai.updateAI(0);
						node.iserrorInput = (aival === undefined);
							
						if (!node.iserrorInput) {
							var aivalret = [2];
							aivalret[0] = Number(syslib.scaleAdc(node.mode0, aival[0], 5.56).toFixed(0)) * node.factor0 + node.offset0;
							aivalret[1] = Number(syslib.scaleAdc(node.mode1, aival[1], 5.56).toFixed(0)) * node.factor1 + node.offset1;
							node.store.set(node.tagnameai, aivalret);
						}
					}
				}

				if (msg.payload === "output")
					node.iserrorOutput = !sysmoduledo.updateDO(0, syslib.swap8Bits(node.store.get(node.tagnamedo)));

				if (node.iserrorInput || node.iserrorOutput)
					syslib.outError(node, "update", "error on update");
				else
					syslib.setStatus(node, node.statustxt);
			}

			node.send(msg);
		});

		node.on('close', function () {
			sysmoduledo.inuseClear();

			if (node.setdi)
				node.store.set(node.tagnamedi, undefined);

			if (node.setdo)
				node.store.set(node.tagnamedo, undefined);

			if (node.setai)
				node.store.set(node.tagnameai, undefined);
		});
	});
}
