import { Promise } from "bluebird";
export class MockRegistryReader {
    constructor(registryData) {
        this.registryData = registryData;
        if (!registryData)
            throw new Error("Must supply valid registry data.");
    }
    readKeys(keyNames, maxDepth = 1) {
        return new Promise((loaded, loadFailed) => {
            const loadKeyNames = (typeof keyNames === "string") ? [keyNames] : keyNames;
            const loadedKeys = {};
            for (const loadKeyName of loadKeyNames) {
                const loadedKey = this.registryData[loadKeyName];
                if (loadedKey) {
                    loadedKeys[loadKeyName] = JSON.parse(JSON.stringify(loadedKey));
                }
            }
            loaded(loadedKeys);
        });
    }
}
