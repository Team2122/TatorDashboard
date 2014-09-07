'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var inject = require('gulp-inject');
var rimraf = require('gulp-rimraf');
var install = require('gulp-install');
var gutil = require('gulp-util');

var path = require('path');
var NwBuilder = require('node-webkit-builder');
var child = require('child_process');
var net = require('net');

var pkg = require('./package.json');

var files = {
  js: ['app/scripts/app.js', 'app/scripts/**/*.js'],
  less: ['app/styles/**/*.less'],
  css: ['app/styles/**/*.css'],
  index: 'app/index.html',
  install: ['package.json', 'bower.json'],
  build: ['package.json', 'app/index.html', 'app/views/**/*', 'app/components/**/*', 'app/scripts/**/*', 'app/styles/**/*.css', 'app/images/**/*']
};

var nw = new NwBuilder({
  files: files.build,
  platforms: ['win'],
  appName: 'TatorDashboard',
  appVersion: pkg.version,
  buildDir: 'nwbuild',
  cacheDir: '.nwcache',
  version: 'latest'
});

gulp.task('jshint', function () {
  return gulp.src(files.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('less', function () {
  return gulp.src(files.less)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./app/styles'));
});

gulp.task('inject', ['less'], function () {
  return gulp.src(files.index)
    .pipe(inject(gulp.src(files.js.concat(files.css), {read: false}), {
      ignorePath: '/app',
      addRootSlash: false
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('build', function () {
  nw.on('log', function (message) {
    gutil.log('node-webkit-builder', message);
  });
  return nw.build();
});

gulp.task('clean', function () {
  return gulp.src(files.css.concat(['./nwbuild']), {read: false})
    .pipe(rimraf());
});

gulp.task('install', function () {
  return gulp.src(files.install)
    .pipe(install());
});

var reload;

gulp.task('watch', function () {
  gulp.watch(files.less, ['less', 'inject']);
  gulp.watch(files.js, ['jshint', 'inject']);
  gulp.watch(files.build, ['reload']);
});

gulp.task('run', ['install', 'inject', 'less', 'watch'], function (done) {
  net.createServer(function (socket) {
    reload = socket;
  }).listen(9292);

  var proc = child.spawn('nw', ['./']);
  proc.on('error', function (err) {
    done("Error running webkit app. Do you have the 'nw' executable in your PATH?\n" + err);
  });
  proc.on('exit', done);
  proc.stderr.pipe(process.stderr);
});

gulp.task('reload', function () {
  if (reload) {
    reload.write('reload');
  }
});

gulp.task('default', ['install', 'jshint', 'inject', 'build']);
