var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

gulp.task('javascript', function () {
  gulp
    .src('js/app.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('build', ['javascript']);
gulp.task('default', ['build']);
