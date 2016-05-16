"use strict";

const gulp = require('gulp');
const ts = require('gulp-tsc');
const nodemon = require('gulp-nodemon');
const mjml = require('gulp-mjml');
const fs = require('fs');
const foreach = require('gulp-foreach');
const glob = require('glob');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const config = JSON.parse(fs.readFileSync('./src/config/config.json'));

//Copy all of the src folder to the build directory
gulp.task('copySrcFolder', () => {
     gulp.src([config.srcFolder])
     .pipe(gulp.dest(config.buildDir))
});



//Helper function that will write file
//also if the folder is not exist
function writeFile(path, contents, cb) {
  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err);

    fs.writeFileSync(path, contents, cb);
  });
}


//Build the email partials
gulp.task('buildEmailParts', () => {
    let layoutParms = {
        appName: config.appName,
        year: new Date().getFullYear()
    };
    let layout = fs.readFileSync(config.emailMainLayout, "utf8");

    //Insert the layout param to the template
    for (let key in layoutParms) {
        //For replace all string not only the first
        //string we use regex with g
        var re = new RegExp('{{' + key +'}}', 'g');
        layout = layout.replace(re, layoutParms[key]);
    }

    glob.sync(config.emailSrcDir).forEach((filePath) => {
        //If the filePath is folder we skip to the next one 
        if (fs.statSync(filePath).isDirectory()) {
            return;
        }

        let fileName = filePath.split('/');
        fileName = fileName[fileName.length -1];
        const fileContent =  fs.readFileSync(filePath, "utf8");
        let template = layout.replace('{{body}}', fileContent);
        writeFile(config.emailPartialsBuild + '/' + fileName, template);
    });
});


//Compile email from MJML to HTML
gulp.task('compileEmail', ['buildEmailParts'], () => {
    gulp.src(config.emailPartialsBuild + '/*.mjml')
    .pipe(mjml())
    .pipe(gulp.dest(config.emailBuildDir))
});

//Compile TypeScript to JavaScript
gulp.task('compile', ['copySrcFolder','compileEmail'], () => {
  gulp.src([config.srcTSFiles])
    .pipe(ts(config.NodeTSOptions))
    .pipe(gulp.dest(config.buildDir));
});

//Compile and run server 
gulp.task('run',['compile'], () => {
    const nodemonOptions = {
        script: config.serverStart,
        ext: 'ts json mjml html'
    };

    nodemon(nodemonOptions).on('restart',['compile'], () => {
        setTimeout(() => {
            console.log("change detected resetting server");
        }, 500)
    });
});