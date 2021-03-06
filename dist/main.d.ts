import { Promise } from "bluebird";
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
/**
 * Provides access to information about the configuration of locally-installed Visual Studio products
 */
export declare class VisualStudio {
    /** Promise representing cached configuration. */
    private static loader;
    /**
     * Load VS information from the registry.
     * @param refresh {boolean} Refresh the configuration if it has already been loaded?
     * @return A promise that resolves to the VisualStudio instance.
     */
    static loadConfiguration(refresh?: boolean): Promise<VisualStudioConfiguration>;
    /**
     * Constants for the names of well-known Visual Studio registry keys.
     * @return {VSKeyNames} The key names.
     */
    private static vsKeyNames;
    /**
     * Get the product installation directory from the specified Visual Studio registry key.
     * @param vsKey {} The Visual Studio registry key.
     * @return The "ProductDir" registry value, or null if not present (or vsKey is null).
     */
    private static getInstallDir(vsKey);
}
