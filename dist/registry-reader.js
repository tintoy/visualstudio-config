var regedit = require("regedit");
var bluebird_1 = require("bluebird");
/**
    A registry reader based on regedit.
 */
var RegeditRegistryReader = (function () {
    function RegeditRegistryReader() {
    }
    /**
     * Read one or more registry keys.
     * @param keyNames {string|string[]} The name / names of registry key(s) to read.
     * @param maxDepth {number} The maximum depth to which the key(s) will be expanded.
     * @return {} An object literal, with properties corresponding to the full path of the loaded key(s).
     * @desc The returned regisry keys are in the following format: Sub-key = object literal, value = property of intrinsic data type.
     */
    RegeditRegistryReader.prototype.readKeys = function (keyNames, maxDepth) {
        if (maxDepth === void 0) { maxDepth = 1; }
        return new bluebird_1.Promise(function (loaded, loadFailed) {
            var loadKeyNames = (typeof keyNames === "string") ? [keyNames] : keyNames;
            var loadedKeys = {};
            // Attempt to load keys individually, since regedit bulk operation errors out if *any* keys are missing.
            var keyLoaders = loadKeyNames.map(function (keyName) { return new bluebird_1.Promise(function (keyLoaded, keyLoadFailed) {
                regedit.list(keyName, function (error, items) {
                    if (error && error.code !== 2 /* key not found */)
                        keyLoadFailed(error);
                    if (items && items[keyName])
                        loadedKeys[keyName] = items[keyName];
                    keyLoaded(undefined);
                });
            }); });
            bluebird_1.Promise.all(keyLoaders)
                .then(function () {
                loaded(loadedKeys);
            })
                .catch(function (error) {
                loadFailed(error);
            });
        });
    };
    return RegeditRegistryReader;
})();
exports.RegeditRegistryReader = RegeditRegistryReader;
