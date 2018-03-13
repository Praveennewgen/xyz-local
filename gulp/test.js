var config = require('./config');

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var path = require('path');
var karma = require('gulp-karma');

gulp.task('test', function() {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('test/spec/**/*.js')
        .pipe(karma({
            configFile: 'karma.config.js',
            action: 'watch'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

gulp.task('autotest', function() {
    return gulp.watch(['test/spec/*.js'], ['test']);
});