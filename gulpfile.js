var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

var sass = require('gulp-sass');
var eyeglass = require('eyeglass');
var sassOptions = {};

var filePath = {
  sass: {
    src: ['client/scss/**/*.scss'],
    dest: 'client/build/css'
  },
  script: {
    src: ['client/js/app.js'],
    dest: 'client/build/js'
  },
  html: {
    src: ['client/html/*.html'],
    dest: 'client/build/html'
  },
  images: {
    src: ['client/images/*.png'],
    dest: 'client/build/images'
  }
};

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

gulp.task('script', function () {
  gulp
    .src(filePath.script.src)
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest(filePath.script.dest));
});

gulp.task('watch-script', function() {
  gulp.watch(filePath.script.src, ['script']);
  gulp.watch(filePath.script.dest).on('change', function(file) {
    console.log("Changed script: " + file.path);
    server.changed(file.path);
  });
});

gulp.task('html', function () {
  gulp
    .src(filePath.html.src)
    .pipe(gulp.dest(filePath.html.dest));
});

gulp.task('watch-html', function() {
  gulp.watch(filePath.html.src, ['html']);
  gulp.watch(filePath.html.dest).on('change', function(file) {
    console.log("Changed html: " + file.path);
    server.changed(file.path);
  });
});

gulp.task('images', function () {
  gulp
    .src(filePath.images.src)
    .pipe(gulp.dest(filePath.images.dest));
});

gulp.task('watch-images', function() {
  gulp.watch(filePath.images.src, ['images']);
  gulp.watch(filePath.images.dest).on('change', function(file) {
    console.log("Changed images: " + file.path);
    server.changed(file.path);
  });
});

gulp.task('build', ['script', 'sass', 'html', 'images']);
gulp.task('watch', ['build', 'watch-script', 'watch-sass', 'watch-html', 'watch-images']);
gulp.task('default', ['build']);
