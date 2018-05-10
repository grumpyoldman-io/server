# server
Home Automation Server

## how it works
It connects to a local MQTT broker, which in turn listens to signals from my Sonoff wall switch.
When a button is pressed, it either turns on/off a light

## Work in progress
1. reset light when turned on.
2. pm2

## Compatability
It includes webpack to transpile the node sripts to be compatible with node 4.2.1 (current Raspberry Pi node version, 2018-05-10)
