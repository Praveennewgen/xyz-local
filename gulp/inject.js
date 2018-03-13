'use strict';

var config = require('./config');

var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var path = require('path');
var wiredep = require('wiredep').stream;

gulp.task('inject', ['scripts', 'styles'], function() {
    var injectStyles = gulp.src([
        path.join(config.paths.bower_components, '/angular-toastr/dist/angular-toastr.css'),
        path.join(config.paths.tmp, '/serve/app/**/*.css'),
        path.join('!' + config.paths.tmp, '/serve/app/vendor.css'),
    ], { read: false });

    var injectScripts = gulp.src([
        path.join(config.paths.src, '/app/**/*.module.js'),
        path.join(config.paths.src, '/app/**/*.js'),
        path.join(config.paths.bower_components, '/auth0.js/build/auth0.js'),
        path.join(config.paths.bower_components, '/angular-data-grid/dist/pagination.min.js'),
        path.join(config.paths.bower_components, '/angular-data-grid/dist/dataGrid.min.js'),
        path.join(config.paths.bower_components, '/marked/lib/marked.js'),
        path.join(config.paths.bower_components, '/angular-md/dist/angular-md.min.js'),
        path.join(config.paths.bower_components, '/angular-toastr/dist/angular-toastr.tpls.js'),
        //path.join(config.paths.bower_components, '/angular-toastr/dist/angular-toastr.js'),

        path.join(config.paths.bower_components, '/angular-stripe/release/angular-stripe.js')
    ]).
    pipe($.angularFilesort()).
    on('error', config.errorHandler('AngularFilesort'));

    var injectOptions = {
        addRootSlash: false,
        ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    };

    return gulp.src(path.join(config.paths.src, '/*.html')).
    pipe($.inject(injectStyles, injectOptions)).
    pipe($.inject(injectScripts, injectOptions)).
    pipe(wiredep(_.extend({}, config.wiredep))).
    pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));
});

gulp.task('inject-reload', ['inject'], function() {
    browserSync.reload();
});