/**
 * Copyright 2021 Ocean (iot.redplc@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use node file except in compliance with the License.
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

"use strict";

const fs = require('fs');

/**
 * Outputs error on status and error log.
 */
module.exports.outError = function (node, errShort, errLong) {
	if (node.save_txt === errShort)
		return true;

	node.save_txt = errShort;
	node.status({ fill: "red", shape: "ring", text: errShort });
	node.error(errLong);

	return true;
}

/**
 * Sets node status.
 */
module.exports.setStatus = function (node, txt) {
	if (node.save_txt === txt)
		return;

	node.save_txt = txt;

	node.status({ fill: "blue", shape: "ring", text: txt });
}

var pins = [4, 17, 27, 23, 22, 24, 11, 7, 8, 9, 25, 10];

/**
 * Get pin from index.
 */
module.exports.getPin = function (index) {
	return pins[index];
}

/**
 * Shift pins data.
 */
module.exports.shiftPins = function (value) {
	var valret = 0;

	for (var i = 0; i < 12; i++) {
		if ((value & (1 << pins[i])) > 0)
			valret |= (1 << i);
	}

	return valret;
}

const MODE_12BIT = 0;
const MODE_14BIT = 1;
const MODE_16BIT = 2;
const MODE_18BIT = 3;

/**
 * Scale adc.
 */
module.exports.scaleAdc = function (mode, value, factor) {
	switch (mode) {
		case MODE_12BIT:
			return value * factor;
		case MODE_14BIT:
			return value * factor / 4;
		case MODE_16BIT:
			return value * factor / 16;
		case MODE_18BIT:
			return value * factor / 64;
		default:
			return 0;
	}
}

/**
 * Swap 8 bits.
 */
module.exports.swap8Bits = function (value) {
	var valret = 0;

	for (var i = 0; i < 8; i++)
		if ((value & (1 << i)) > 0)
			valret |= (1 << (7 - i));

	return valret;
}

/**
 * Check if runs on Raspberry Pi.
 */
function isRaspberryPi()
{
	if (process.platform !== 'linux')
		return false;

	var cpuinfo = fs.readFileSync("/proc/cpuinfo").toString();

	if (cpuinfo.indexOf(": BCM") === -1)
		return false;

	return true;
}

/**
 * Check for Raspberry Pi, if matchs loads hardware driver module.
 */
module.exports.LoadModule = function (module, testrpi = false) {
	try {
		if (testrpi)
			if (!isRaspberryPi())
				return;
		return require("./" + module);
	}
	catch (e) { console.log(e); }
	return undefined;
}
