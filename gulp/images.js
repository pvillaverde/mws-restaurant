/*eslint-env node*/
var gulp = require(`gulp`),
	conf = require(`./conf`),
	$ = require(`gulp-load-plugins`)({
		pattern: [`gulp-*`]
	});

gulp.task(`images`, (done) => {
	const restaurantImagesOptions = [{
		width: 400,
		rename: {
			suffix: `-400`,
		},
	}, {
		width: 800,
		rename: {
			suffix: `-800`,
		},
	}, /* WebP format*/ {
		width: 400,
		rename: {
			suffix: `-400`,
			extname: `.webp`
		},
		format: `webp`,
	}, {
		width: 800,
		rename: {
			suffix: `-800`,
			extname: `.webp`
		},
		format: `webp`
	}];
	gulp.src(`${conf.paths.src}/assets/icons/**/*`)
		.pipe(gulp.dest(`${conf.paths.dest}/assets/icons/`));
	gulp.src(`${conf.paths.src}/assets/images/**/*`)
		.pipe(gulp.dest(`${conf.paths.dest}/assets/img/`));
	gulp.src(`${conf.paths.src}/assets/src-images/**/*`)
		.pipe($.responsive({
			'**/*.jpg': restaurantImagesOptions
		}, {
			errorOnEnlargement: true,
			errorOnUnusedConfig: true
		}))
		.pipe(gulp.dest(`${conf.paths.dest}/assets/img/`))
		.on(`end`, done);
});