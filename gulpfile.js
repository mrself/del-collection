var gulp = require('gulp'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	gutil = require('gulp-util'),
	notify = require('gulp-notify'),
	browserify = require('browserify');

var outputName = 'app.min.js';
gulp.task('browserify', function() {
	var bundler = browserify({
		cache: {}, packageCache: {}, fullPaths: true,
		entries: ['./tests/collection.js']
	});

	var watcher = watchify(bundler);
	function bundle () {
		return watcher
			.bundle()
			.on('error', handleErrors)
			.pipe(source(outputName))
			.pipe(gulp.dest('./tests'))
			.on('end', function() {
				gutil.log('end');
			});

	}
	watcher.on('update', bundle);
	return bundle();
});

function handleErrors (error) {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: "Compile Error",
		message: "<%= error.message %>"
	}).apply(this, args);
	this.emit('end');
}

gulp.task('default', ['browserify']);