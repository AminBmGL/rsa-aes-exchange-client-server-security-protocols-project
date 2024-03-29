(function () {

    'use strict';

    var crypto = window.crypto.subtle;
 

    // generating the client part of the session key
    function dec2hex (dec) {
        return ('0' + dec.toString(16)).substr(-2)
      }
      
      function generateKeyPart (len) {
        var arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return Array.from(arr, dec2hex).join('')
      }
      
      
    

    // wrapper for importing AES key for using with crypto library
    function importPublicKey(key){
        return new Promise(function (resolve, rej) {
            crypto.importKey("raw", converterWrapper.base64StringToArrayBuffer(key),
                {
                    name: "AES-CBC"
                },
                false, //whether the key is extractable (i.e. can be used in exportKey)
                ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
            ).then(function (cryptKey) {
                resolve(cryptKey);
            },function(err){
                console.log(err.message)
            });
        });
    }

    // separate initialization vector from message
    function separateVectorFromData(data) {
        var iv = data.slice(-24);
        var message = data.substring(0, data.length - 24)

        return{
            iv: iv,
            message: message
        };
    }

    // add initialization vector to message
    function getMessageWithIv(message, iv) {
        return converterWrapper.arrayBufferToBase64String(message) + converterWrapper.arrayBufferToBase64String(iv);
    }


    function encryptMessage(key, message) {

        var iv = window.crypto.getRandomValues(new Uint8Array(16));

        return new Promise(function (resolve, rej) {
            importPublicKey(key).then(function (key){
                crypto.encrypt(
                    {
                        name: "AES-CBC",
                        //Don't re-use initialization vectors!
                        //Always generate a new iv every time your encrypt!
                        iv: iv
                    },
                    key, //from generateKey or importKey above
                    converterWrapper.str2abUtf8(message) //ArrayBuffer of data you want to encrypt
                )
                    .then(function (encrypted) {
                        encrypted = getMessageWithIv(encrypted, iv);
                        resolve(encrypted);
                    });
            });
        });
    }

    function decryptMessage(key, message) {
        var data = aesWrapper.separateVectorFromData(message);

        return new Promise(function (resolve, rej) {
            importPublicKey(key).then(function (key) {
                crypto.decrypt(
                    {
                        name: "AES-CBC",
                        iv: converterWrapper.base64StringToArrayBuffer(data['iv']),
                    },
                    key, //from generateKey or importKey above
                    converterWrapper.base64StringToArrayBuffer(data['message']) //ArrayBuffer of data you want to encrypt
                )
                    .then(function (decrypted) {
                        resolve(converterWrapper.arrayBufferToUtf8(decrypted));
                    });
            });
        });
    }

    window.aesWrapper = {
        generateKeyPart:generateKeyPart,
        encryptMessage: encryptMessage,
        decryptMessage: decryptMessage,
        importPublicKey: importPublicKey,
        separateVectorFromData: separateVectorFromData,
    }

}());