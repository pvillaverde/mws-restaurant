/*eslint-env node*/
const gulp = require(`gulp`),
	conf = require(`./conf`),
	browserSync = require(`browser-sync`).create(),
	$ = require(`gulp-load-plugins`)({
		pattern: [`gulp-*`]
	});

gulp.task(`watch`, [`images`, `sass`], () => {
	gulp.watch(`${conf.paths.sass}/*/*.scss`, (obj) => {
		console.log(`Updating SASS`, obj.path);
		gulp.start(`sass`);
	}).on(`change`, () => browserSync.reload());
	browserSync.init({
		server: `www/`,
		port: 8000,
	});
	browserSync.stream();
});
gulp.task(`lint`, () => {
	gulp.src([`${conf.paths.src}/app/**/*.js`])
		// Check
		.pipe($.eslint())
		//Output result
		.pipe($.eslint.format())
		//Exit with error and pipe to fail
		.pipe($.eslint.failOnError());

});
gulp.task(`tests`, () => {
	gulp.src([`${conf.paths.src}/tests/extraSpec.js`])
		.pipe($.jasmine({
			integration: true,
			vendor: `${conf.paths.src}/app/**/*.js`
		}));

});