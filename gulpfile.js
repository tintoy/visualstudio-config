var gulp = require("gulp");
var tsc = require("gulp-tsc");
var mocha = require("gulp-mocha");

var tsConfig = require("./src/tsconfig.json").compilerOptions;
var testTSConfig = require("./src/tests/tsconfig.json").compilerOptions;

gulp.task("default", ["build", "test"]);

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
