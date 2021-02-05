# node-red-contrib-redplc-unipi11

redPlc module node for Unipi 1.1.<br>

## Install
[redPlc use this module node. Install redPlc.](https://www.npmjs.com/package/node-red-contrib-redplc)

[If you use this node for other nodes install this.](https://www.npmjs.com/package/node-red-contrib-redplc-module)

Install with Node-Red Palette Manager or npm command:
```
cd ~/.node-red
npm install node-red-contrib-redplc-unipi11
```

[Unipi 1.1 more Info](https://www.unipi.technology/unipi-1-1-p36)

## Usage
Wire this node to first output of redPlc cpu node.<br>
Global variable I are updated with digital inputs.<br>
Global variable Q sets relays.<br>
Global variable IA are updated with analog inputs.<br>
Analog input has input range 0..10V.<br>
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

## Donate
If you like my work please support it with donate:

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZDRCZBQFWV3A6)
