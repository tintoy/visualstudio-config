"use strict";
var regedit = require("regedit");
var bluebird_1 = require("bluebird");
var VisualStudio = (function () {
    function VisualStudio() {
    }
    VisualStudio.loadConfiguration = function (refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        if (this.loader && !refresh)
            return this.loader;
        this.loader = new bluebird_1.Promise(function (loaderResolve, loaderReject) {
            var configurations = {};
            var vsKeyNames = _this.vsKeyNames;
            var keys = {};
            var keyLoaders = vsKeyNames.allKeyNames.map(function (keyName) { return new bluebird_1.Promise(function (keyLoaderResolve, keyLoaderReject) {
                regedit.list(keyName, function (error, items) {
                    if (error && error.code !== 2)
                        keyLoaderReject(error);
                    if (items && items[keyName])
                        keys[keyName] = items[keyName];
                    keyLoaderResolve();
                });
            }); });
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
        get: function () {
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
