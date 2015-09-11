var gulp = require("gulp");
var tsc = require("gulp-tsc");
var mocha = require("gulp-mocha");

var tsConfig = require("./src/tsconfig.json").compilerOptions;

gulp.task("default", ["build", "test"]);

gulp.task("build", function() {
    return gulp.src("src/**/*.ts")
        .pipe(
        	tsc(tsConfig)
        )
        .pipe(gulp.dest("dist"));
});

gulp.task("test", ["build"], function() {
    return gulp.src("dist/tests/**/*.spec.js")
        .pipe(
            mocha()
        );
});
