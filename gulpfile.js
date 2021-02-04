const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const del = require("del");
const newer = require("gulp-newer");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const rename = require("gulp-rename");
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const fileinclude = require('gulp-file-include');
const webpack = require("webpack");
const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");


function browserSync(done) {
	browsersync.init({
	  server: {
		baseDir: "./dist/"
	  },
	});
	done();
  }
  
  // BrowserSync Reload
  function browserSyncReload(done) {
	browsersync.reload();
	done();
  }

  // Clean assets
function clean() {
	return del(["./dist/"]);
  }

  // Images
  function images() {
	return gulp
	.src("./src/img/**/*")
	.pipe(newer("./dist/img"))
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 75, progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
	.pipe(gulp.dest("./dist/img"));
  }

  // CSS task
function styles() {
	return gulp
		.src('./src/scss/main.scss')
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					sound: false,
					message: err.message
				};
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename({suffix: '.min', prefix: ''}))
		.pipe(autoprefixer({
			browsers: ['last 6 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css/'))
		.pipe(browsersync.stream());
}

function html() {
	return gulp.src('./src/**/*.html')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'HTML include',
				sound: false,
				message: err.message
			};
		})
	}))
	.pipe(fileinclude({
		prefix: '@@'
	}))
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('./dist/'))
	.pipe(browsersync.stream());
}


// Transpile, concatenate and minify scripts
function scripts() {
	return (
	  gulp
		.src(["./src/js/**/*"])
		.pipe(plumber())
		.pipe(webpackstream(webpackconfig, webpack))
		// folder only, filename is specified in webpack config
		.pipe(gulp.dest("./dist/"))
		.pipe(browsersync.stream())
	);
  }

function fonts() {
	return gulp.src("./src/fonts/**/*")
	.pipe(gulp.dest("./dist/fonts"));
}
  
  // Jekyll
/* function jekyll() {
	return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
} */

  function watchFiles() {
	gulp.watch("./src/scss/**/*.+(scss|css)", styles);
	gulp.watch("./src/**/*.html", html);
	gulp.watch("./src/**/*.js", gulp.series(scripts));
	gulp.watch(
	  [
		"./_includes/**/*",
		"./_layouts/**/*",
		"./_pages/**/*",
		"./_posts/**/*",
		"./_projects/**/*"
	  ],
	  gulp.series(browserSyncReload)
	);
	gulp.watch("./src/img/**/*", images);
	gulp.watch("/src/fonts/**/*", fonts);
  }

  // define complex tasks
/* const js = gulp.series(scriptsLint, scripts); */
const build = gulp.series(clean, gulp.parallel(html, styles, images, scripts));
const watch = gulp.parallel(watchFiles, browserSync);

const user = gulp.parallel(watchFiles, browserSync, html, fonts, styles, images, scripts);

// export tasks
exports.images = images;
exports.styles = styles;
exports.html = html;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.user = user;

exports.default = user;