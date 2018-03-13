var gulp = require('gulp'),
	conf = require('./conf'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*']
	});

gulp.task('watch', ['sass'], function() {
	gulp.watch(conf.paths.sass, function(obj) {
		console.log("Updating SASS", obj.path);
		gulp.start('sass');
	});
});