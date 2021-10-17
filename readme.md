# get-ca

A NodeJS + Typescript program to get the CA certificate of a website.  

Originally [written in go](https://github.com/vmasdani/get-ca)  
Meant to be run as sub-app with master: [nodemaster](https://github.com/vmasdani/nodemaster)

## Background
Why make this program at all, when most high-level HTTP clients are already able to automatically fetch CA certificates for HTTPS exchange?  
  
Precisely because **high-level** HTTP clients are able to. But what about small micro-controllers like ESP8266/ESP32 with limited processing power? They cannot get a CA certificate on their own because they do not have the capability of high-level CA cert fetching. This app tries to solve that issue.

## How it works
The general idea is to make the micro-controller (which do not have the capability of fetching a web site's CA cert on its own) to access this app via an insecure HTTP port, fetch the CA cert, and then use the CA cert to do secure HTTPS operation.  

The main goal is to ensure that CA certs are not hard-coded into the firmware/source code to avoid updating the firmware every few year(s), but can be fetched dynamically through an external source.  
  
To invoke a CA cert fetching, just run this app as a sub-app of [nodemaster](https://github.com/vmasdani/nodemaster):  

then invoke the HTTP endpoint like this:
```
http://localhost:3000?url=platform.antares.id&port=8443
```

and voila, there's your CA cert.  

This app runs `openssl` in the background each time the CA fetch is invoked.  

## Disclaimer
I do not know if this is the best practice to achieve non hard-coded CA cert for microcontroller HTTPS operations, but currently this is the best option I can think of. If you have any inputs on security vulnerabilities please contact my email at [valianmasdani@gmail.com](mailto:valianmasdani@gmail.com) or open a new issue in this repository, to ensure that I get notified.  
  
This software is MIT Licensed.