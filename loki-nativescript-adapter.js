/**
 * Loki NativeScript Adapter
 * @author Tobias Hennig <toias.hennig1@gmail.com>
 *
 * Example:
 * var fs = require("file-system");
 * var path = fs.path.join(fs.knownFolders.currentApp().path, "loki.db");
 * var tnsAdapter = new LokiNativeScriptAdapter();
 * var db = new Loki(path, { adapter: tnsAdapter });
 *
 * A NativeScript Adapter
 */

function LokiFsCustomSystemAdapter(key) {
    this.key = key;
    this.fs = require('file-system');
    this.worker = new Worker('./service-worker');
    var self = this;

    this.worker.onmessage = function(msg) {
        console.log('onmessage on adapter', JSON.stringify(msg));

        if(msg.data.error){
            console.log('error on serviceworker' + JSON.stringify(msg.data.error));
            self.worker.terminate();
            return;
        }
        switch (msg.data.resultType) {
            case 'save':
                if (self.saveCallback) {
                    self.saveCallback();
                }
                break;
            case 'load':
                if(self.loadCallback){
                    self.loadCallback(msg.data.content);
                }
                break;
        
            default: console.log('resultType not implemented:' +  msg.data.resultType);
                break;
        }
    }

    this.worker.onerror = function(err) {
        console.log(`An unhandled error occurred in worker: ${err.filename}, line: ${err.lineno} :`);
        console.log(err.message);
    }
}

/**
 * saveDatabase() - save data to file, will throw an error if the file can't be saved
 * @param {string} dbname - the filename of the database to load
 * @param {string} dbstring - the string to be written to the database
 * @param {function} callback - the callback to handle the result
 */
LokiFsCustomSystemAdapter.prototype.saveDatabase = function saveDatabase(dbname, dbstring, callback) {
    this.saveCallback = callback;
    this.worker.postMessage({ action: 'save', dbname: dbname, dbstring: dbstring, key: this.key });
    
};

/**
 * loadDatabase() - Load data from file, will throw an error if the file does not exist
 * @param {string} dbname - the filename of the database to load
 * @param {function} callback - the callback to handle the result
 */
LokiFsCustomSystemAdapter.prototype.loadDatabase = function loadDatabase(dbname, callback) {
    this.loadCallback = callback;
    this.worker.postMessage({ action: 'load', dbname: dbnam, key: this.key });
    
};

module.exports = LokiFsCustomSystemAdapter;