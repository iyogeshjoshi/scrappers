/**
 * Gulpfile to convert all swf file in 'output' folder to
 * html file in 'output/html' folder
 * Author: Yogesh Joshi (iyogeshjoshi@gmail.com)
 */

var gulp = require('gulp'),
  swiffy = require('gulp-swiffy');

// gulp task to convert swf to html file
gulp.task('default', function() {
  gulp.src('output/*.swf')
    .pipe(swiffy()) // same as swiffy('html'); it can be also swiffy('json')
    .pipe(gulp.dest(console.log));
    // .pipe(gulp.dest('output/html/'));
});
