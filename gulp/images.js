var gulp = require('gulp'),
	conf = require('./conf'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'del']
	});

gulp.task('cleanImages', function() {
	return $.del([`${conf.paths.dest}/assets/img/*`], {
		force: true
	});
});

gulp.task('images', ['cleanImages'], (done) => {
	const restaurantImagesOptions = [{
		width: 400,
		rename: {
			suffix: '-400'
		}
	}, {
		width: 800,
		rename: {
			suffix: '-800'
		}
	}];
	gulp.src('src-images/**/*')
		.pipe($.responsive({
			'*': restaurantImagesOptions
		}))
		.pipe(gulp.dest(`${conf.paths.dest}/assets/img/`))
		.on('end', done);
});