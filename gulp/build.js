/*eslint-env node*/
const gulp = require(`gulp`),
	conf = require(`./conf`),
	//browserSync = require('browser-sync').create(),
	$ = require(`gulp-load-plugins`)({
		pattern: [`gulp-*`, `del`]
	});

gulp.task(`build`, [`clean`, ], (finish) => {
	return $.sequence(`copy-default`, `build-scripts`, `sass`, `images`)(() => {
		console.log(`#################################################`);
		console.log(`Build finished. Run "http-server -p 8000 -c-1 -g" on www folder`);
		finish();
	});
});

gulp.task(`copy-default`, () => {
	return gulp.src([
			`${conf.paths.src}/sw.js`,
			`${conf.paths.src}/manifest.json`,
			`${conf.paths.src}/**/*.html`,
			`${conf.paths.src}/**/*.css`,
			`${conf.paths.src}/**/*.{eot,svg,ttf,woff,woff2}`
		])
		.pipe(gulp.dest(conf.paths.dest));
});
gulp.task(`copy-scripts`, () => {
	return gulp.src([`${conf.paths.src}/app/**/*.js`])
		.pipe(gulp.dest(`${conf.paths.dest}/app/`));
});
gulp.task(`build-scripts`, () => {
	return gulp.src([`${conf.paths.src}/app/**/*.js`])
		//	.pipe($.sourcemaps.init())
		.pipe($.babel({
			presets: [`env`],
			/*plugins: [`es6-promise`]*/
		}))
		/*.pipe($.concat(`main.js`))*/
		.pipe($.uglify().on(`error`, conf.errorHandler))
		//	.pipe($.sourcemaps.write())
		.pipe(gulp.dest(`${conf.paths.dest}/app/`));
});

gulp.task(`clean`, () => {
	return $.del([`${conf.paths.dest}/`], {
		force: true
	});
});

gulp.task(`lint`, () => {
	return gulp.src([`${conf.paths.src}/app/**/*.js`])
		// Check
		.pipe($.eslint())
		//Output result
		.pipe($.eslint.format())
		//Exit with error and pipe to fail
		.pipe($.eslint.failOnError());

});