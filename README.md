# visualstudio-config
Basic information about installed instances of Visual Studio.

## Usage
```javascript
var VisualStudio = require("visualstudio-config");
VisualStudio.loadConfiguration().then(function(configuration) {
	if (configuration.vs2015)
	{
		var vs2015InstallDir = configuration.vs2015.installDir;

		// Do something with that.
	}
});
```

Supported VS versions are:
* Visual Studio 2015 (v14.0)
* Visual Studio 2013 (v12.0)
* Visual Studio 2010 (v10.0)
