var gulp = require("gulp");
var tsc = require("gulp-tsc");
var babel = require("gulp-babel");

gulp.task("default", function() {
  return gulp.src("src/**/*.ts")
    .pipe(
    	tsc({
    		target: "ES5",
            declaration: true
    	})
    )
    .pipe(gulp.dest("dist"));
});
