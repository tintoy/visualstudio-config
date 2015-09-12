var gulp = require("gulp");
var mocha = require("gulp-mocha");
var tsc = require("gulp-tsc");
var tslint = require("gulp-tslint");

var tsConfig = require("./src/tsconfig.json").compilerOptions;
var testTSConfig = require("./src/tests/tsconfig.json").compilerOptions;
var tslintConfig = require("./src/tslint.json");

gulp.task("default", ["analyze", "build", "test"]);

gulp.task("analyze", function () {
	return gulp.src(["src/**/*.ts", "!src/**/*.d.ts"])
		.pipe(
			tslint({
				configuration: tslintConfig
			})
		)
		.pipe(
			tslint.report("verbose", {
				emitError: false
        	})
		);
});

gulp.task("build", [
	"build:app",
	"build:tests"
]);

gulp.task("build:app", function() {
	return gulp.src(["src/**/*.ts", "!src/tests/**/*.ts"])
		.pipe(
			tsc(tsConfig)
		)
		.pipe(
			gulp.dest("dist")
		);
});

gulp.task("build:tests", function() {
	return gulp.src("src/tests/**/*.ts")
		.pipe(
			tsc(testTSConfig)
		)
		.pipe(
			gulp.dest("dist")
		);
});


gulp.task("test", ["build:tests"], function() {
	return gulp.src("dist/tests/**/*.spec.js")
		.pipe(
			mocha()
		);
});
