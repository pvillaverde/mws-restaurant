var gulp = require('gulp'),
	conf = require('./conf'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*']
	});


gulp.task('sass', function(done) {
	gulp.src(conf.paths.sass)
		.pipe($.sass())
		.on('error', $.sass.logError)
		.pipe($.cleanCss({
			keepSpecialComments: 0
		}))
		.pipe($.concat('styles.css'))
		.pipe(gulp.dest(conf.paths.dest + '/assets/css/'))
		.on('end', done);
});