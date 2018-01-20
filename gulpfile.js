var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var eslint = require('gulp-eslint');
var extend = require('extend');
var runSequence = require('run-sequence');
var logger = require('winston');

var sftp = require('gulp-sftp');

// Options for deploying to development
var sftpDevelopmentOptions = {
	host: 'rocgamedev.org',
	auth: 'keyMain',
	authFile: '.ftppass',
	remotePath: 'www/dev'
};

// Options for deploying to production
var sftpProductionOptions = extend(true, {}, sftpDevelopmentOptions, {
	remotePath: 'www'
});

var sass = require('gulp-sass');
var eyeglass = require('eyeglass');
var sassOptions = {};

var filePath = {
	server: {
		src: [
			'modules/*.js',
			'spect/*.js',
			'!node_modules/**'
		]
	},
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
		src: ['client/images/*'],
		dest: 'client/build/images'
	}
};

gulp.task('sass', function () {
	gulp
		.src(filePath.sass.src)
		.pipe(sass(eyeglass(sassOptions)).on('error', sass.logError))
		.pipe(gulp.dest(filePath.sass.dest));
});

gulp.task('script', function () {
	gulp
		.src(filePath.script.src)
		.pipe(browserify())
		.pipe(uglify())
		.pipe(gulp.dest(filePath.script.dest));
});

gulp.task('html', function () {
	gulp
		.src(filePath.html.src)
		.pipe(gulp.dest(filePath.html.dest));
});

gulp.task('images', function () {
	gulp
		.src(filePath.images.src)
		.pipe(gulp.dest(filePath.images.dest));
});

gulp.task('watch:script', function() {
	gulp.watch(filePath.script.src, ['script']);
	gulp.watch(filePath.script.dest).on('change', function(file) {
		logger.info('Changed script: ' + file.path);
	});
});

gulp.task('watch:sass', function() {
	gulp.watch(filePath.sass.src, ['sass']);
	gulp.watch(filePath.sass.dest).on('change', function(file) {
		logger.info('Changed sass: ' + file.path);
	});
});

gulp.task('watch:html', function() {
	gulp.watch(filePath.html.src, ['html']);
	gulp.watch(filePath.html.dest).on('change', function(file) {
		logger.info('Changed html: ' + file.path);
	});
});

gulp.task('watch:images', function() {
	gulp.watch(filePath.images.src, ['images']);
	gulp.watch(filePath.images.dest).on('change', function(file) {
		logger.info('Changed images: ' + file.path);
	});
});

gulp.task('lint:script', function () {
	var allScriptPaths = filePath.script.src.concat(filePath.server.src);
	return gulp.src(allScriptPaths)
		.pipe(eslint())
		.pipe(eslint.format('node_modules/eslint-path-formatter'))
		.pipe(eslint.failAfterError());
});

gulp.task('test', function () {
	var mocha = require('gulp-mocha');
	return gulp
		.src('./spec/*-spec.js')
		.pipe(mocha({bail: true}));
});

gulp.task('upload:production', ['test'], function() {
	var src = [].concat(filePath.server.src);
	src.push('package.json');
	src.push(filePath.script.dest + '/**/*');
	src.push(filePath.sass.dest + '/**/*');
	src.push(filePath.html.dest + '/**/*');
	src.push(filePath.images.dest + '/**/*');

	return gulp
		.src(src, {base: './'})
		.pipe(sftp(sftpProductionOptions));
});

gulp.task('upload:development', function() {
	var src = [].concat(filePath.server.src);
	src.push('package.json');
	src.push(filePath.script.dest + '/**/*');
	src.push(filePath.sass.dest + '/**/*');
	src.push(filePath.html.dest + '/**/*');
	src.push(filePath.images.dest + '/**/*');

	return gulp
		.src(src, {base: './'})
		.pipe(sftp(sftpDevelopmentOptions));
});


gulp.task('build', ['script', 'sass', 'html', 'images']);
gulp.task('watch', ['build', 'watch:script', 'watch:sass', 'watch:html', 'watch:images']);
gulp.task('deploy:production', function (callback) {
	runSequence(
		'lint:script',
		'test',
		'build',
		'upload:production',
		callback
	);
});
gulp.task('deploy:development', function (callback) {
	runSequence(
		'lint:script',
		'test',
		'build',
		'upload:development',
		callback
	);
});
gulp.task('default', ['lint:script', 'test', 'script']);
