NodeJS and browser RSA / AES encryption Examples
================================================

Description
------------
Example of exchanging encrypted  messages between server and client using simple
Nodejs express framework and websocket library socket.io infrastructure for best visualisation.
Client encryption side is written with browser javascript Web CryptoApi.
Server side is written with Nodejs crypto and Nodejs node-rsa

[READ DETAILED INFO IN ARTICLE](https://medium.com/@weblab_tech/encrypted-client-server-communication-protection-of-privacy-and-integrity-with-aes-and-rsa-in-c7b180fe614e#.6pvs68jnn)

Requirements
------------
nodejs 6 and >

Generate keys
---------------
~~~~~~~~~~~~~~~~~~
node generate
then add the client public key , client private key and server public key to localStorage (look at index.html in the script section to find the structure of data required in localStorage  )
~~~~~~~~~~~~~~~~~~
Run
---
~~~~~~~~~~~~~~~~~~
node start
~~~~~~~~~~~~~~~~~~
starting web server with websockets on 3000 port


Remarqs
---
~~~~~~~~~~~~~~~~~~
Problems:
The session key is for now generated randomly without contract between server and client 
