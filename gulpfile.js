"use strict";

const gulp = require('gulp');
const ts = require('gulp-tsc');
const nodemon = require('gulp-nodemon');

const app = {
    srcFolder: './src/**',
    srcTSFiles: './src/**/*.ts',
    serverStart: './.build/core/main.js',
    buildDir: './.build',
    NODE_ENV: 'development'
};

const NodeTSOptions = {
	target: "es6",
	module: "commonjs",
	sourceMap: false,
	emitDecoratorMetadata: true,
    experimentalDecorators: true,
    removeComments: true,
    noImplicitAny: false
};

gulp.task('copySrcFolder', () => {
     gulp.src([app.srcFolder])
     .pipe(gulp.dest(app.buildDir))
});

 
gulp.task('compile', ['copySrcFolder'], () => {
  gulp.src([app.srcTSFiles])
    .pipe(ts(NodeTSOptions))
    .pipe(gulp.dest(app.buildDir));
});

gulp.task('run',['compile'], () => {
    const nodemonOptions = {
        script: app.serverStart,
        ext: 'ts json'
    };

    nodemon(nodemonOptions).on('restart',['compile'], () => {
        setTimeout(() => {
            console.log("change detected resetting server");
        }, 500)
    });
});