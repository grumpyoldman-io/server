# server
Home Automation Server

## how it works
It connects to a local MQTT broker, which in turn listens to signals from my Sonoff wall switch.
When a button is pressed, it either turns on/off a light

## Compatability
It includes webpack to transpile the node sripts to be compatible with node 4.2.1 (current Raspberry Pi node version, 2018-05-10)
