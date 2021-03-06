"use strict";
var regedit = require("regedit");
var bluebird_1 = require("bluebird");
// TODO: Consider using edge.js to invoke Powershell for the registry stuff - this is just irritatingly obtuse.
/**
 * Provides access to information about the configuration of locally-installed Visual Studio products
 */
var VisualStudio = (function () {
    function VisualStudio() {
    }
    /**
     * Load VS information from the registry.
     * @param refresh {boolean} Refresh the configuration if it has already been loaded?
     * @return A promise that resolves to the VisualStudio instance.
     */
    VisualStudio.loadConfiguration = function (refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        if (this.loader && !refresh)
            return this.loader;
        this.loader = new bluebird_1.Promise(function (loaderResolve, loaderReject) {
            var configurations = {};
            var vsKeyNames = _this.vsKeyNames;
            var keys = {};
            // Attempt to load keys individually, since regedit bulk operation errors out if *any* keys are missing.
            var keyLoaders = vsKeyNames.allKeyNames.map(function (keyName) { return new bluebird_1.Promise(function (keyLoaderResolve, keyLoaderReject) {
                regedit.list(keyName, function (error, items) {
                    if (error && error.code !== 2 /* key not found */)
                        keyLoaderReject(error);
                    if (items && items[keyName])
                        keys[keyName] = items[keyName];
                    keyLoaderResolve(null);
                });
            }); });
            // Once we're all down, scrape the registry data and pass it along.
            bluebird_1.Promise.all(keyLoaders)
                .then(function () {
                var vsInstallDir = _this.getInstallDir(keys[vsKeyNames.vs2010.vs]);
                if (vsInstallDir) {
                    configurations.vs2010 = {
                        edition: "unknown",
                        installDir: vsInstallDir
                    };
                }
                vsInstallDir = _this.getInstallDir(keys[vsKeyNames.vs2013.vs]);
                if (vsInstallDir) {
                    configurations.vs2013 = {
                        edition: "unknown",
                        installDir: vsInstallDir
                    };
                }
                vsInstallDir = _this.getInstallDir(keys[vsKeyNames.vs2015.vs]);
                if (vsInstallDir) {
                    configurations.vs2015 = {
                        edition: "unknown",
                        installDir: vsInstallDir
                    };
                }
                loaderResolve(configurations);
            })
                .catch(function (error) { return loaderReject(error); });
        });
        return this.loader;
    };
    Object.defineProperty(VisualStudio, "vsKeyNames", {
        /**
         * Constants for the names of well-known Visual Studio registry keys.
         * @return {VSKeyNames} The key names.
         */
        get: function () {
            // If we're runnin in 64-bit Node then we need to explicitly target the 32-bit registry.
            var wow6432Prefix = process.arch === "x64" ? "\\Wow6432Node" : "";
            var vsKeyPrefix = "HKLM\\SOFTWARE" + wow6432Prefix + "\\Microsoft\\VisualStudio\\";
            var keyNames = {
                vs2010: {
                    isoShell: vsKeyPrefix + "10.0\\Setup\\IsoShell",
                    vs: vsKeyPrefix + "10.0\\Setup\\vs"
                },
                vs2013: {
                    isoShell: vsKeyPrefix + "12.0\\Setup\\IsoShell",
                    vs: vsKeyPrefix + "12.0\\Setup\\vs"
                },
                vs2015: {
                    isoShell: vsKeyPrefix + "14.0\\Setup\\IsoShell",
                    vs: vsKeyPrefix + "14.0\\Setup\\vs"
                },
                allKeyNames: null
            };
            keyNames.allKeyNames = [
                keyNames.vs2010.isoShell,
                keyNames.vs2010.vs,
                keyNames.vs2013.isoShell,
                keyNames.vs2013.vs,
                keyNames.vs2015.isoShell,
                keyNames.vs2015.vs
            ];
            return keyNames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the product installation directory from the specified Visual Studio registry key.
     * @param vsKey {} The Visual Studio registry key.
     * @return The "ProductDir" registry value, or null if not present (or vsKey is null).
     */
    VisualStudio.getInstallDir = function (vsKey) {
        if (!vsKey)
            return null;
        if (vsKey.values.ProductDir && vsKey.values.ProductDir.value)
            return vsKey.values.ProductDir.value;
        return null;
    };
    return VisualStudio;
})();
exports.VisualStudio = VisualStudio;
