'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  watch = require('gulp-watch'),
  concat = require('gulp-concat-util');

gulp.task('copy', function() {
  gulp.src(['app/**/*.js'])
    .pipe(concat.scripts('stuff.js'))
    .pipe(gulp.dest('dist'));

  gulp.src(['app/**/*.html'])
    .pipe(gulp.dest('dist'));

  gulp.src(['app/**/*.css'])
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['copy', 'browser-sync'], function () {
  watch(['app/**/*.(js|html|css)'], function (cb){
    gulp.start('copy');
  })
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
    proxy: "http://localhost:5000",
    browser: "google-chrome",
    files: ["dist/*.*"],
    port: 7000
	});
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
    verbose: true,
    ignore: ["dist/*"],
		script: './server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});
