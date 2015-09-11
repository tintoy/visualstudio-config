const regedit		= require("regedit");

import {Promise}	from "bluebird";

/**
	Represents a facility for reading data from the Windows registry.
 */
export interface IRegistryReader {
	/**
	 * Read one or more registry keys.
	 * @param keyNames {string|string[]} The name / names of registry key(s) to read.
	 * @param maxDepth {number} The maximum depth to which the key(s) will be expanded.
	 * @return {} An object literal, with the key name(s) acting as key(s)s into the registry key data.
	 * @desc The returned regisry keys are in the following format: Sub-key = object literal, value = typed property.
	 */
    readKeys(keyNames: string|string[], maxDepth: number) : Promise<any>;
}

/**
	A registry reader based on regedit.
 */
export class RegeditRegistryReader implements IRegistryReader {
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

			// Attempt to load keys individually, since regedit bulk operation errors out if *any* keys are missing.
			const keyLoaders: Promise<void>[] =
				loadKeyNames.map(
					keyName => new Promise<void>((keyLoaded, keyLoadFailed) => {
						regedit.list(keyName, (error, items) => {
							if (error && error.code !== 2 /* key not found */)
								keyLoadFailed(error);

							if (items && items[keyName])
								loadedKeys[keyName] = items[keyName];

							keyLoaded(undefined);
						});
					})
				);

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
