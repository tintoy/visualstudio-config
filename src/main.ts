"use strict";

const regedit		= require("regedit");

import {Promise}	from "bluebird";
import * as _		from "lodash";

/** The configurations for all installed versions of Visual Studio */
export interface VisualStudioConfiguration {
	/** Configuration for Visual Studio 2010 (v10.0), if present */
	vs2010?: VisualStudioVersion;

	/** Configuration for Visual Studio 2013 (v12.0), if present */
	vs2013?: VisualStudioVersion;

	/** Configuration for Visual Studio 2015 (v14.0), if present */
	vs2015?: VisualStudioVersion;
}

/** The configuration for a specific version of Visual Studio */
export interface VisualStudioVersion {
	/** The edition of Visual Studio (e.g. "community", "pro", "enterprise", "ultimate")  */
	edition: string;

	/** The main product install directory */
	installDir: string;
}

// TODO: Consider using edge.js to invoke Powershell for the registry stuff - this is just irritatingly obtuse.

/**
 * Provides access to information about the configuration of locally-installed Visual Studio products
 */
export class VisualStudio {
	/** Promise representing cached configuration. */
	private static loader: Promise<VisualStudioConfiguration>;

	/**
	 * Load VS information from the registry.
	 * @param refresh {boolean} Refresh the configuration if it has already been loaded?
	 * @return A promise that resolves to the VisualStudio instance.
	 */
	public static loadConfiguration(refresh: boolean = false): Promise<VisualStudioConfiguration> {
		if (this.loader && !refresh)
			return this.loader;

		this.loader = new Promise<VisualStudioConfiguration>((loaderResolve, loaderReject) => {
			const configurations: VisualStudioConfiguration = {};

			const vsKeyNames : VSKeyNames = this.vsKeyNames;
			const keys: any = {};

			// Attempt to load keys individually, since regedit bulk operation errors out if *any* keys are missing.
			const keyLoaders = vsKeyNames.allKeyNames.map(keyName => new Promise<void>(
				(keyLoaderResolve, keyLoaderReject) => {
					regedit.list(keyName, (error, items) => {
						if (error && error.code !== 2 /* key not found */)
							keyLoaderReject(error);

						if (items && items[keyName])
							keys[keyName] = items[keyName];

						keyLoaderResolve(null);
					});
				})
			);

			// Once we're all down, scrape the registry data and pass it along.
			Promise.all(keyLoaders)
				.then(() => {
					let vsInstallDir = this.getInstallDir(
						keys[vsKeyNames.vs2010.vs]
					);
					if (vsInstallDir)
					{
						configurations.vs2010 = {
							edition: "unknown",
							installDir: vsInstallDir
						};
					}

					vsInstallDir = this.getInstallDir(
						keys[vsKeyNames.vs2013.vs]
					);
					if (vsInstallDir)
					{
						configurations.vs2013 = {
							edition: "unknown",
							installDir: vsInstallDir
						};
					}

					vsInstallDir = this.getInstallDir(
						keys[vsKeyNames.vs2015.vs]
					);
					if (vsInstallDir)
					{
						configurations.vs2015 = {
							edition: "unknown",
							installDir: vsInstallDir
						};
					}

					loaderResolve(configurations);
				})
				.catch(
					error => loaderReject(error)
				);
		});

		return this.loader;
	}

	/** 
	 * Constants for the names of well-known Visual Studio registry keys.
	 * @return {VSKeyNames} The key names.
	 */
	private static get vsKeyNames(): VSKeyNames {
		// If we're runnin in 64-bit Node then we need to explicitly target the 32-bit registry.
		const wow6432Prefix = process.arch === "x64" ? "\\Wow6432Node" : "";
		const vsKeyPrefix = `HKLM\\SOFTWARE${wow6432Prefix}\\Microsoft\\VisualStudio\\`;

		const keyNames : VSKeyNames = {
			vs2010: {
				isoShell: `${vsKeyPrefix}10.0\\Setup\\IsoShell`,	// VS isolated shell (e.g. installed with SSDT)
				vs: `${vsKeyPrefix}10.0\\Setup\\vs`
			},
			vs2013: {
				isoShell: `${vsKeyPrefix}12.0\\Setup\\IsoShell`,	// VS isolated shell (e.g. installed with SSDT)
				vs: `${vsKeyPrefix}12.0\\Setup\\vs`
			},
			vs2015: {
				isoShell: `${vsKeyPrefix}14.0\\Setup\\IsoShell`,	// VS isolated shell (e.g. installed with SSDT)
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

	/**
	 * Get the product installation directory from the specified Visual Studio registry key.
	 * @param vsKey {} The Visual Studio registry key.
	 * @return The "ProductDir" registry value, or null if not present (or vsKey is null).
	 */
	private static getInstallDir(vsKey: any): string {
		if (!vsKey)
			return null;

		if (vsKey.values.ProductDir && vsKey.values.ProductDir.value)
			return vsKey.values.ProductDir.value;

		return null;
	}
}

/**
 * Registry sub-key names for all versions of Visual Studio.
 */
interface VSKeyNames {
	/** Well-known registry key names for Visual Studio 2010 */
	vs2010: VS2010KeyNames;

	/** Well-known registry key names for Visual Studio 2013 */
	vs2013: VS2013KeyNames;

	/** Well-known registry key names for Visual Studio 2015 */
	vs2015: VS2015KeyNames;

	/** All well-known registry key names relating to Visual Studio. */
	allKeyNames: string[];
}

/**
 * Registry sub-key names common to all VS versions
 */
interface VSVersionKeyNames {
	/** Product: Visual Studio Isolated Shell (e.g. as used by SSDT) */
	isoShell: string;
	
	/** Information about the primary install of this version of Visual Studio */
	vs: string;
}

/**
 * Registry sub-key names for VS 2010.
 */
interface VS2010KeyNames extends VSVersionKeyNames {
}

/**
 * Registry sub-key names for VS 2013.
 */
interface VS2013KeyNames extends VSVersionKeyNames {
}

/**
 * Registry sub-key names for VS 2015.
 */
interface VS2015KeyNames extends VSVersionKeyNames {
}
