var bluebird_1 = require("bluebird");
var MockRegistryReader = (function () {
    function MockRegistryReader(registryData) {
        this.registryData = registryData;
        if (!registryData)
            throw new Error("Must supply valid registry data.");
    }
    MockRegistryReader.prototype.readKeys = function (keyNames, maxDepth) {
        var _this = this;
        if (maxDepth === void 0) { maxDepth = 1; }
        return new bluebird_1.Promise(function (loaded, loadFailed) {
            var loadKeyNames = (typeof keyNames === "string") ? [keyNames] : keyNames;
            var loadedKeys = {};
            for (var _i = 0; _i < loadKeyNames.length; _i++) {
                var loadKeyName = loadKeyNames[_i];
                var loadedKey = _this.registryData[loadKeyName];
                if (loadedKey) {
                    loadedKeys[loadKeyName] = JSON.parse(JSON.stringify(loadedKey));
                }
            }
            loaded(loadedKeys);
        });
    };
    return MockRegistryReader;
})();
exports.MockRegistryReader = MockRegistryReader;
