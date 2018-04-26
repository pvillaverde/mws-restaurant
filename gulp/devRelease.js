/*eslint-env node*/
const gulp = require(`gulp`),
	conf = require(`./conf`),
	browserSync = require(`browser-sync`).create(),
	$ = require(`gulp-load-plugins`)({
		pattern: [`gulp-*`, `compression`]
	});

gulp.task(`dev-watch`, [`copy-default`, `copy-scripts`, `images`, `sass`], () => {
	browserSync.init({
		server: {
			baseDir: `www/`,
			middleware: [$.compression()]
		},
		/*proxy: {
			target: `localhost:1337`,
			middleware: [$.compression()]
		},*/
		/*https: true,*/
		/*https: {
		    key: "path-to-custom.key",
		    cert: "path-to-custom.crt"
		}*/
		port: 8000,
	});
	browserSync.stream();
	gulp.watch(`${conf.paths.src}/**/*.js`, function(obj) {
		console.log(`Updating JS: `, obj.path);
		gulp.src(obj.path, {
				"base": conf.paths.src
			})
			.pipe(gulp.dest(conf.paths.dest));
	}).on(`change`, () => browserSync.reload());
	gulp.watch(`${conf.paths.src}/**/*.html`, function(obj) {
		console.log(`Updating HTML: `, obj.path);
		gulp.src(obj.path, {
				"base": conf.paths.src
			})
			.pipe(gulp.dest(conf.paths.dest));
	}).on(`change`, () => browserSync.reload());
	gulp.watch(`${conf.paths.sass}/**/*.scss`, function(obj) {
		console.log(`Updating SASS`, obj.path);
		gulp.start(`sass`);
	}).on(`change`, () => browserSync.reload());
});

gulp.task(`tests`, () => {
	gulp.src([`${conf.paths.src}/tests/extraSpec.js`])
		.pipe($.jasmine({
			integration: true,
			vendor: `${conf.paths.src}/app/**/*.js`
		}));

});