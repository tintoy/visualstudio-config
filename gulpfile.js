var gulp = require("gulp");
var tsc = require("gulp-tsc");
var babel = require("gulp-babel");

gulp.task("default", function() {
  return gulp.src("src/**/*.ts")
    .pipe(
    	tsc({
    		target: "ES6",
            declaration: true
    	})
    )
    // .pipe(
    // 	babel()
    // )
    .pipe(gulp.dest("dist"));
});
