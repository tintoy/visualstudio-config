const regedit = require("regedit");
import { Promise } from "bluebird";
export class RegeditRegistryReader {
    readKeys(keyNames, maxDepth = 1) {
        return new Promise((loaded, loadFailed) => {
            const loadKeyNames = (typeof keyNames === "string") ? [keyNames] : keyNames;
            const loadedKeys = {};
            const keyLoaders = loadKeyNames.map(keyName => new Promise((keyLoaded, keyLoadFailed) => {
                regedit.list(keyName, (error, items) => {
                    if (error && error.code !== 2)
                        keyLoadFailed(error);
                    if (items && items[keyName])
                        loadedKeys[keyName] = items[keyName];
                    keyLoaded(undefined);
                });
            }));
            Promise.all(keyLoaders)
                .then(() => {
                loaded(loadedKeys);
            })
                .catch(error => {
                loadFailed(error);
            });
        });
    }
}
