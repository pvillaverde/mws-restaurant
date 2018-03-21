const gulp = require('gulp'),
	conf = require('./conf'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*']
	});

gulp.task('watch', ['images', 'sass'], () => {
	gulp.watch(`${conf.paths.sass}/*/*.scss`, (obj) => {
		console.log("Updating SASS", obj.path);
		gulp.start('sass');
	});
});