var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

var sass = require('gulp-sass');
var eyeglass = require('eyeglass');
var sassOptions = {};

var filePath = {
  sass: {
    src: ['scss/**/*.scss'],
    dest: './css'
  },
  script: {
    src: ['js/app.js'],
    dest: 'build/js'
  }
};

gulp.task('script', function () {
  gulp
    .src('js/app.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('watch-script', function() {
  gulp.watch(filePath.script.src, ['script']);
  gulp.watch(filePath.script.dest).on('change', function(file) {
    console.log("Changed script: " + file.path);
    server.changed(file.path);
  });
});

gulp.task('sass', function () {
  gulp
    .src(filePath.sass.src)
    .pipe(sass(eyeglass(sassOptions)).on("error", sass.logError))
    .pipe(gulp.dest(filePath.sass.dest));
});

gulp.task('watch-sass', function() {
  gulp.watch(filePath.sass.src, ['sass']);
  gulp.watch(filePath.sass.dest).on('change', function(file) {
    console.log("Changed sass: " + file.path);
    server.changed(file.path);
  });
});

gulp.task('build', ['script', 'sass']);
gulp.task('watch', ['watch-script', 'watch-sass']);
gulp.task('default', ['build']);
