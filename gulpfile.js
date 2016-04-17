'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var addSrc = require('gulp-add-src');

// set the path
var vendor_files = [
	'bower_components/jquery/dist/jquery.js',	//jquery
	'bower_components/bootstrap/dist/js/bootstrap.js', //bootstrap
];

var vendor_css = {
	bootstrap: 'bower_components/bootstrap/dist/css/bootstrap.css', //bootstrap
	normalizecss: 'src/sass/vendor/normalize.css', //normalization css
	fontaweson: 'bower_components/components-font-awesome/scss/**/*.scss', //font awesom scss
};

var vendor_fonts = [
	'bower_components/bootstrap/dist/fonts/**/*.*',
	'bower_components/components-font-awesome/fonts/**/*.*',

];
/*----------------------------
sass file
-----------------------------*/
 
gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(rename('main.min.css'))
    .pipe(gulp.dest('app_dev/css/'));
});

gulp.task('sass:concat:vendor', function() {
	return gulp.src(vendor_css.normalizecss)
		.pipe(concat('vendor.min.css'))
		.pipe(addSrc.append(vendor_css.bootstrap))
		.pipe(concat('vendor.min.css'))
		.pipe(addSrc.append(vendor_css.fontaweson))
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('app_dev/css/vendor/'))
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

/*------------------------------
js file compile
-------------------------------*/

// concatinates all vendor files into one
gulp.task('js:vendor', function() {
	return gulp.src(vendor_files)
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('app_dev/js/vendor/'))
});

/*-------------------------------
html file move
--------------------------------*/

gulp.task('html', function(){
	return gulp.src('src/index.html')
		.pipe(gulp.dest('app_dev/'))
});

gulp.task('html:watch', function(){
	gulp.watch('src/index.html', ['html']);
})
/*-------------------------------
font file move
--------------------------------*/

gulp.task('font', function(){
	return gulp.src(vendor_fonts)
		.pipe(gulp.dest('app_dev/css/fonts/'))
});

/*------------------------------
server
-------------------------------*/

gulp.task('serve', ['sass:watch', 'html:watch'],function(){
	browserSync({
		notify: false,
		port: 8000,
		server: {
			baseDir: ['app_dev/views/pages', 'app_dev'],
		}
	});
});

// The default task
gulp.task('default', ['sass:watch', 'html:watch']);


/*------------------------------
main build script
-------------------------------*/

gulp.task('build', ['js:vendor', 'sass', 'html', 'sass:concat:vendor', 'font'])