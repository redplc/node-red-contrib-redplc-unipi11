# node-red-contrib-redplc-unipi11

Node-Red node for Unipi 1.1<br>

## Node Features
- 12 x 5-24V Digital Inputs<br>
- 8 x Relays<br>
- 2 x Analog Inputs (0..10V)<br>
- Each analog input can be selected 12bit-18bit or Disabled
- 12bit conversion time 5ms/channel
- 14bit conversion time 25ms/channel
- 16bit conversion time 100ms/channel
- 18bit conversion time 300ms/channel
- Analog input value in mV
- Scaling with factor and offset

## Install

For using with Ladder-Logic install
[redPlc](https://www.npmjs.com/package/node-red-contrib-redplc) nodes

For using with other nodes, install
[module](https://www.npmjs.com/package/node-red-contrib-redplc-module) nodes

Install with Node-Red Palette Manager or npm command:
```
cd ~/.node-red
npm install node-red-contrib-redplc-unipi11
```

## Usage
Update is triggered by redPlc cpu node<br>
or module-update node<br>
This node reads/writes from/to Node-Red global variables<br>
This node works only on Raspberry Pi with Raspberry Pi OS.<br>
Enable I2C with raspi-config.

## I/O Mapping
### Digital Input (Variable I):
|Bit|Function|
|:-:|:-------|
|0|I01|
|1|I02|
|2|I03|
|3|I04|
|4|I05|
|5|I06|
|6|I07|
|7|I08|
|8|I09|
|9|I10|
|10|I11|
|11|I12|

### Digital Output (Variable Q):
|Bit|Function|
|:-:|:-------|
|0|Relay 1|
|1|Relay 2|
|2|Relay 3|
|3|Relay 4|
|4|Relay 5|
|5|Relay 6|
|6|Relay 7|
|7|Relay 8|

### Analog Input (Variable IA):
|Array-Index|Input|
:---------:|:----|
|0|AI1|
|1|AI2|

### Scaling with Factor and Offset:

```
Formula:

Factor = (OH - OL) / (IH - IL)
Offset = OL - (IL * Factor)

Output = Input * Factor + Offset

Where:

IL = Input Low (mV), IH = Input High (mV) 
OL = Output Low, OH = Output High
```
### Example:
Input:  0mV .. 10000mV, IL = 0, IH = 10000<br>
Output: -20°C .. 60°C, OL = -20, OH = 60<br>
**Factor** = (60 - (-20)) / (10000 - 0) = **0.008**<br>
**Offset** = (-20) - (0 * 0.008) = **-20**<br>

Input = 4000mV<br>
Output = 4000 * 0.008 + (-20) = 12°C<br>

## Donate
If you like my work please support it with donate:

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZDRCZBQFWV3A6)
