const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rsaWrapper = require('./components/rsa-wrapper');
const aesWrapper = require('./components/aes-wrapper');

rsaWrapper.initLoadServerKeys(__dirname);
rsaWrapper.serverExampleEncrypt();

// middleware for static processing
app.use(express.static(__dirname + '/static'));

// web socket connection event
io.on('connection', function(socket){

    let aesKey;
    
    // Test sending to client dummy RSA message
    console.log("----------------Server sending 'Hello RSA message from client to server' message  encrypted to the client")
    let encrypted = rsaWrapper.encrypt(rsaWrapper.clientPub, 'Hello RSA message from client to server');
    socket.emit('rsa server encrypted message', encrypted);

    // Test accepting dummy RSA message from client
    socket.on('rsa client encrypted message', function (data) {
        console.log('------------------------------Server received RSA message from client');
        console.log('Encrypted message is', '\n', data);
        console.log('Decrypted message', '\n', rsaWrapper.decrypt(rsaWrapper.serverPrivate, data));
    });

    socket.on('rsa encrypted client part of session key', function (data) {
        console.log('------------------------------Server received client Aes part encrypted');
        console.log('Encrypted key part is', '\n', data);
        clientPart=rsaWrapper.decrypt(rsaWrapper.serverPrivate, data);
        console.log('decrypted key part is', '\n', clientPart);

        // Test AES key sending
     aesKey = aesWrapper.generateKey(clientPart);
    let encryptedAesKey = rsaWrapper.encrypt(rsaWrapper.clientPub, (aesKey.toString('base64')));
    console.log("----------------Server generated a session key (AES) encrypted and  sent it to the client")
    socket.emit('send session key from server to client', encryptedAesKey);
    });

    

    // Test accepting dummy AES key message
    socket.on('aes client encrypted message', function (data) {
         console.log('-------------------Server received AES message from client', '\n', 'Encrypted message is', '\n', data);
        console.log('Decrypted message', '\n', aesWrapper.decrypt(aesKey, data));

        // Test send client dummy AES message
        let message = aesWrapper.createAesMessage(aesKey, 'Server AES message');
        console.log('--------------------Server sended AES message to client');
        socket.emit('aes server encrypted message', message);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
