var gulp = require('gulp'),
	conf = require('./conf'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*']
	});

gulp.task('sass', (done) => {
	const injectFiles = gulp.src([
		`${conf.paths.sass}/**/_*.scss`,
		`!${conf.paths.sass}/**/conf/*.scss`
	], {
		read: false
	});
	const injectOptions = {
		transform: (filePath) => `@import "${filePath}";`,
		starttag: '// injector',
		endtag: '// endinjector',
		addRootSlash: false
	};
	gulp.src([`${conf.paths.sass}/main.scss`])
		.pipe($.inject(injectFiles, injectOptions))
		.pipe($.sass())
		.on('error', $.sass.logError)
		.pipe($.cleanCss({
			keepSpecialComments: 0
		}))
		.pipe($.concat('styles.css'))
		.pipe(gulp.dest(`${conf.paths.dest}/assets/css/`))
		.on('end', done);
});