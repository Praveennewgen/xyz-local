'use strict';

var gulpUtil = require('gulp-util');

exports.mainAngularModule = 'iot';

exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  bower_components: 'bower_components',
};

exports.wiredep = {
  directory: 'bower_components',
};

exports.htmlminOptions = {
  collapseBooleanAttributes: false,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
};

exports.errorHandler = function(title) {
  return function(err) {
    gulpUtil.log(gulpUtil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
