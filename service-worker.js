require('globals'); // necessary to bootstrap tns modules on the new thread

var fs = require('file-system');

onmessage = function(msg) {

    switch(msg.data.action){

        case 'save':
            var file = fs.File.fromPath(msg.data.dbname);

            file.writeText(msg.data.dbstring)
                .then(function () {
                    postMessage({ resultType: 'save', message: 'success'});
                }, function (err) {
                    postMessage({ message: 'error', error: new Error(err) });
                    
                });
        break;

        case 'load':
            var file = fs.File.fromPath(msg.data.dbname);
            
            file.readText()
                .then(function (content) {
                    postMessage({ resultType: 'load', message: 'success', content: content});
                }, function (err) {
                    postMessage({message: 'error', error: new Error(err) });
                });           
        break;

        default: console.log('Action not implemented:' + msg.data.action);break;
    }
}



