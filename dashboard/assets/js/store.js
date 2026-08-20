/*
* Store — the only module that touches localStorage. Every page reads and
* writes content exclusively through get/save/reset so a real backend can
* replace the body of these three functions later without touching any
* page controller.
*/
(function (global) {
    var PREFIX = "maxdev-dashboard:";

    function readRaw(collection) {
        var raw = localStorage.getItem(PREFIX + collection);
        return raw ? JSON.parse(raw) : undefined;
    }

    function writeRaw(collection, value) {
        localStorage.setItem(PREFIX + collection, JSON.stringify(value));
    }

    var Store = {
        get: function (collection) {
            var value = readRaw(collection);
            if (value === undefined) {
                var seed = global.SEED ? global.SEED[collection] : undefined;
                value = seed !== undefined ? JSON.parse(JSON.stringify(seed)) : null;
                writeRaw(collection, value);
            }
            return value;
        },
        save: function (collection, data) {
            writeRaw(collection, data);
            return data;
        },
        reset: function (collection) {
            var seed = global.SEED ? global.SEED[collection] : undefined;
            var value = seed !== undefined ? JSON.parse(JSON.stringify(seed)) : null;
            writeRaw(collection, value);
            return value;
        }
    };

    global.Store = Store;
})(window);
