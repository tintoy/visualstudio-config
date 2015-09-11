import {IRegistryReader}	from "../../registry-reader";
import {Promise}			from "bluebird";

/**
 * Mock implementation of {IRegistryReader} that "loads" registry keys from a pre-configured object literal
 */
export class MockRegistryReader implements IRegistryReader {
	/**
		Create a new mock registry reader.
		@param registryData {} An object whose properties / values correspond to the registry keys and their data.
	 */
	constructor(private registryData: any) {
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
	readKeys(keyNames: string|string[], maxDepth: number = 1) : Promise<any> {
		return new Promise<any>((loaded, loadFailed) => {
			const loadKeyNames: string[] = (typeof keyNames === "string") ? [keyNames] : keyNames;

			const loadedKeys: any = {};
			for (const loadKeyName of loadKeyNames) {
				const loadedKey = this.registryData[loadKeyName];
				if (loadedKey) {
					// Hacky clone.
					loadedKeys[loadKeyName] = JSON.parse(
						JSON.stringify(loadedKey)
					);
				}
			}

			loaded(loadedKeys);
		});
	}
}
