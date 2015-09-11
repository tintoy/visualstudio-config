"use strict";
const regedit = require("regedit");
import { Promise } from "bluebird";

export class VisualStudio {
    static loadConfiguration(refresh = false) {
        if (this.loader && !refresh)
            return this.loader;
        this.loader = new Promise((loaderResolve, loaderReject) => {
            const configurations = {};
            const vsKeyNames = this.vsKeyNames;
            const keys = {};
            const keyLoaders = vsKeyNames.allKeyNames.map(keyName => new Promise((keyLoaderResolve, keyLoaderReject) => {
                regedit.list(keyName, (error, items) => {
                    if (error && error.code !== 2)
                        keyLoaderReject(error);
                    if (items && items[keyName])
                        keys[keyName] = items[keyName];
                    keyLoaderResolve(undefined);
                });
            }));
            Promise.all(keyLoaders)
                .then(() => {
                let vsInstallDir = this.getInstallDir(keys[vsKeyNames.vs2010.vs]);
                if (vsInstallDir) {
                    configurations.vs2010 = {
                        edition: "unknown",
                        installDir: vsInstallDir
                    };
                }
                vsInstallDir = this.getInstallDir(keys[vsKeyNames.vs2013.vs]);
                if (vsInstallDir) {
                    configurations.vs2013 = {
                        edition: "unknown",
                        installDir: vsInstallDir
                    };
                }
                vsInstallDir = this.getInstallDir(keys[vsKeyNames.vs2015.vs]);
                if (vsInstallDir) {
                    configurations.vs2015 = {
                        edition: "unknown",
                        installDir: vsInstallDir
                    };
                }
                loaderResolve(configurations);
            })
                .catch(error => loaderReject(error));
        });
        return this.loader;
    }
    static get vsKeyNames() {
        const wow6432Prefix = process.arch === "x64" ? "\\Wow6432Node" : "";
        const vsKeyPrefix = `HKLM\\SOFTWARE${wow6432Prefix}\\Microsoft\\VisualStudio\\`;
        const keyNames = {
            vs2010: {
                isoShell: `${vsKeyPrefix}10.0\\Setup\\IsoShell`,
                vs: `${vsKeyPrefix}10.0\\Setup\\vs`
            },
            vs2013: {
                isoShell: `${vsKeyPrefix}12.0\\Setup\\IsoShell`,
                vs: `${vsKeyPrefix}12.0\\Setup\\vs`
            },
            vs2015: {
                isoShell: `${vsKeyPrefix}14.0\\Setup\\IsoShell`,
                vs: `${vsKeyPrefix}14.0\\Setup\\vs`
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
    }
    static getInstallDir(vsKey) {
        if (!vsKey)
            return null;
        if (vsKey.values.ProductDir && vsKey.values.ProductDir.value)
            return vsKey.values.ProductDir.value;
        return null;
    }
}
