var bluebird_1 = require("bluebird");
/**
 * Mock implementation of {IRegistryReader} that "loads" registry keys from a pre-configured object literal
 */
var MockRegistryReader = (function () {
    /**
        Create a new mock registry reader.
        @param registryData {} An object whose properties / values correspond to the registry keys and their data.
     */
    function MockRegistryReader(registryData) {
        this.registryData = registryData;
        if (!registryData)
            throw new Error("Must supply valid registry data.");
    }
    /**
     * Read one or more registry keys.
     * @param keyNames {string|string[]} The name / names of registry key(s) to read.
     * @param maxDepth {number} The maximum depth to which the key(s) will be expanded.
     * @return {} An object literal, with properties corresponding to the full path of the loaded key(s).
     * @desc The returned regisry keys are in the following format: Sub-key = object literal, value = property of intrinsic data type.
     */
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
                    // Hacky clone.
                    loadedKeys[loadKeyName] = JSON.parse(JSON.stringify(loadedKey));
                }
            }
            loaded(loadedKeys);
        });
    };
    return MockRegistryReader;
})();
exports.MockRegistryReader = MockRegistryReader;
