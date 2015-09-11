var regedit = require("regedit");
var bluebird_1 = require("bluebird");
var RegeditRegistryReader = (function () {
    function RegeditRegistryReader() {
    }
    RegeditRegistryReader.prototype.readKeys = function (keyNames, maxDepth) {
        if (maxDepth === void 0) { maxDepth = 1; }
        return new bluebird_1.Promise(function (loaded, loadFailed) {
            var loadKeyNames = (typeof keyNames === "string") ? [keyNames] : keyNames;
            var loadedKeys = {};
            var keyLoaders = loadKeyNames.map(function (keyName) { return new bluebird_1.Promise(function (keyLoaded, keyLoadFailed) {
                regedit.list(keyName, function (error, items) {
                    if (error && error.code !== 2)
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
