/*eslint-env node*/
const gulp = require(`gulp`),
	conf = require(`./conf`),
	//browserSync = require('browser-sync').create(),
	$ = require(`gulp-load-plugins`)({
		pattern: [`gulp-*`, `del`]
	});

gulp.task(`build`, [`copy-default`, `build-scripts`, `sass`, `images`], () => {

});

gulp.task(`copy-default`, [`copy-html`, `copy-data`, `copy-sw`]);
gulp.task(`copy-html`, () => {
	return gulp.src([`${conf.paths.src}/**/*.html`])
		.pipe(gulp.dest(conf.paths.dest));
});
gulp.task(`copy-data`, () => {
	return gulp.src([`${conf.paths.src}/**/*.json`])
		.pipe(gulp.dest(conf.paths.dest));
});
gulp.task(`copy-sw`, () => {
	return gulp.src([`${conf.paths.src}/sw.js`])
		.pipe(gulp.dest(conf.paths.dest));
});
gulp.task(`build-scripts`, () => {
	return gulp.src([`${conf.paths.src}/app/**/*.js`])
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			presets: [`env`],
			plugins: [`es6-promise`]
		}))
		/*.pipe($.concat(`main.js`))*/
		.pipe($.uglify().on(`error`, conf.errorHandler))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(`${conf.paths.dest}/app/`));
});

gulp.task(`clean`, () => {
	return $.del([`${conf.paths.dest}/`], {
		force: true
	});
});