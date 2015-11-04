'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Opens a URL in web browser
var browserify = require('browserify'); //Bundles JS
var reactify = require('reactify'); //Transform React JSX to JS
var source = require('vinyl-source-stream'); //Use conventional text streams with Gulp
var concat = require('gulp-concat'); // Concatenates files
var lint = require('gulp-eslint'); //Lint JS files, including JSX

var config = {
	port: 8089,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js:'./src/**/*.js',
		images:'./src/images/*',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
		],
		dist: './dist',
		mainJs: './src/main.js'
	}
}

//Start a local development server , connect is the local dev server we loaded from npm
gulp.task('connect',function  () {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

//Open Index at local host
gulp.task('open',['connect'],function(){
	gulp.src('dist/index.html')
		.pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

//Task to move html files from source folder to dist folder (distribution) and reload dev server
gulp.task('html',function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js',function(){
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('css',function(){
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
});


//Migrate images to dist folder
//Note that we could even optimize images here
gulp.task('images',function() {
	gulp.src(config.paths.images)
		.pipe(gulp.dest(config.paths.dist +'/images'))
		.pipe(connect.reload());

	//publish favicon
	gulp.src('./src/favicon.ico')
		.pipe(gulp.dest(config.paths.dist));
});

gulp.task('lint',function(){
	return gulp.src(config.paths.js)
			.pipe(lint({config: 'eslint.config.json'}))
			.pipe(lint.format());
});

gulp.task('watch',function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.js,['js','lint']);
});

//Default task to invoke easily from command line
gulp.task('default',['html','js','css','images','lint','open','watch']);