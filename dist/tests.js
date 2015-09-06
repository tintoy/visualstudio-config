"use strict";
var main_1 = require("./main");
main_1.VisualStudio.loadConfiguration()
    .then(function (configuration) {
    console.dir(configuration);
})
    .catch(function (error) {
    console.log("Caught by loadConfiguration callback -", error);
});
