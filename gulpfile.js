/**
 * Desctop Caputure Shareビルドスクリプト
 */

// config
var configFile = 'config/config.js';

// *** chromeの拡張機能
var clientBase          = 'client/';
var popupSassFiles      = clientBase + 'scss/*.scss';
var popupSassBuildDir   = clientBase + 'build/css/';
var popupScriptFiles    = [configFile, 'client/js/class.js', 'client/js/knockout.js', 'client/js/popup.js'];
var popupScriptBuildDir = clientBase + 'build/js/';
var bgScriptFiles       = [clientBase + 'js/class.js', clientBase + 'js/RecordRTC.js', clientBase + 'js/peer.js', clientBase + 'js/app_peer.js', clientBase + 'js/background.js'];
var bgScriptBuildDir    = clientBase + 'build/js/';
var clientHtmlFiles     = clientBase + 'html/*.html';
var clientHtmlBuildDir  = clientBase + 'build/html/';

// *** webroot側
var webBase                = 'webroot/';
var webSassFiles           = webBase + 'scss/*.scss';
var webSassBuildDir        = webBase + 'build/css/';
var webJsFiles             = [configFile];
var webJsBuildDir          = webBase + 'build/js/';
var webHtmlFiles           = webBase + 'html/*.html';
var webHtmlBuildDir        = webBase + '/';

var webPolymerHtmlFiles    = [webBase + 'vendors/polymer/**/*.html'];
var webPolymerJsFiles      = [webBase + 'vendors/polymer/**/*.js', webBase + 'vendors/polymer/**/*.js.map'];
var webPolymerCssFiles     = [webBase + 'vendors/polymer/**/*.css'];
var webPeerJsFiles         = [webBase + 'vendors/peerjs/*.js'];
var webComponentsHtmlFiles = [webBase + 'components/*.html'];

var webPolymerHtmlBuildDir    = webBase + 'build/vendors/polymer/';
var webPolymerJsBuildDir      = webBase + 'build/vendors/polymer/';
var webPolymerCssBuildDir     = webBase + 'build/vendors/polymer/';
var webPeerJsBuildDir         = webBase + 'build/vendors/peerjs/';
var webComponentsHtmlBuildDir = webBase + 'build/components/';


// requires
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var vulcanize = require('gulp-vulcanize');
var minifyInline = require('gulp-minify-inline');
var runSequence = require('run-sequence');


/**
 * Google Chrome App タスク
 */
// popup用cssの生成
gulp.task('build-client-popup-sass', function() {
  gulp.src(popupSassFiles)
  .pipe(sass())
  .pipe(concat('popup.css'))
  .pipe(gulp.dest(popupSassBuildDir))
  .pipe(minifyCss())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest(popupSassBuildDir));
});
 
// popup用jsの生成
gulp.task('build-client-popup-script', function() {
  gulp.src(popupScriptFiles)
  .pipe(concat('popup.js'))
  .pipe(gulp.dest(popupScriptBuildDir))
  .pipe(uglify())
  .pipe(rename({extname: '.min.js'}))
  .pipe(gulp.dest(popupScriptBuildDir));
});

// background用jsの生成
gulp.task('build-client-bg-script', function() {
  gulp.src(bgScriptFiles)
  .pipe(concat('background.js'))
  .pipe(gulp.dest(bgScriptBuildDir))
  .pipe(uglify())
  .pipe(rename({extname: '.min.js'}))
  .pipe(gulp.dest(bgScriptBuildDir));
});

// web用htmlの生成
gulp.task('build-client-html', function () {
  // knockout.jsを使ってるので comments: trueは必須
  var minifyHtmlOption = {comments: true, quotes: true, spare: false, empty: true};
  gulp.src(clientHtmlFiles)
  .pipe(minifyHtml(minifyHtmlOption))
  .pipe(gulp.dest(clientHtmlBuildDir));
});


// ウォッチャー
gulp.task('build-client-watch', function() {
  gulp.watch(popupSassFiles, function(event) {
    gulp.run('build-client-popup-sass');
  });
  gulp.watch(popupScriptFiles, function(event) {
    gulp.run('build-client-popup-script');
  });
  gulp.watch(bgScriptFiles, function(event) {
    gulp.run('build-client-bg-script');
  });
  gulp.watch(clientHtmlFiles, function(event) {
    gulp.run('build-client-html');
  });
});

// 全て実行
gulp.task('build-client', ['build-client-popup-sass', 'build-client-popup-script', 'build-client-bg-script', 'build-client-html']);


/**
 * web app タスク
 */
// web用cssの生成
gulp.task('build-web-sass', function() {
  return gulp.src(webSassFiles)
  .pipe(sass())
  .pipe(gulp.dest(webSassBuildDir))
  .pipe(minifyCss())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest(webSassBuildDir));
});

// web用jsの生成
gulp.task('build-web-script', function() {
  return gulp.src(webJsFiles)
  .pipe(concat('all.js'))
  .pipe(gulp.dest(webJsBuildDir))
  .pipe(uglify())
  .pipe(rename({extname: '.min.js'}))
  .pipe(gulp.dest(webJsBuildDir));
});

// Polymer関連のbuildは先に実行する
gulp.task('pre-build-polymer-html', function () {
  // {spare: false, empty: true}にしないとpolymerのLayout機能と折り合わない
  var minifyHtmlOption = {comments: false, quotes: true, spare: false, empty: true};
  return gulp.src(webPolymerHtmlFiles)
  .pipe(minifyInline())
  .pipe(minifyHtml(minifyHtmlOption))
  .pipe(gulp.dest(webPolymerHtmlBuildDir));
});
gulp.task('pre-build-polymer-js', function () {
  return gulp.src(webPolymerJsFiles)
  .pipe(gulp.dest(webPolymerJsBuildDir));
});
gulp.task('pre-build-polymer-css', function () {
  return gulp.src(webPolymerCssFiles)
  .pipe(minifyCss())
  .pipe(gulp.dest(webPolymerCssBuildDir));
});
gulp.task('pre-build-peer-js', function () {
  return gulp.src(webPeerJsFiles)
  .pipe(gulp.dest(webPeerJsBuildDir));
});
gulp.task('pre-build-components-html', function () {
  // {spare: false, empty: true}にしないとpolymerのLayout機能と折り合わない
  var minifyHtmlOption = {comments: false, quotes: true, spare: false, empty: true};
  return gulp.src(webComponentsHtmlFiles)
  .pipe(minifyInline())
  .pipe(minifyHtml(minifyHtmlOption))
  .pipe(gulp.dest(webComponentsHtmlBuildDir));
});
// web用htmlの生成の実行
gulp.task('exec-build-web-html', function() {
  // {spare: false, empty: true}にしないとpolymerのLayout機能と折り合わない
  var minifyHtmlOption = {comments: false, quotes: true, spare: false, empty: true};
  gulp.src(webHtmlFiles)
  .pipe(vulcanize({dest: webHtmlBuildDir}))
  .pipe(minifyInline())
  .pipe(minifyHtml(minifyHtmlOption))
  .pipe(gulp.dest(webHtmlBuildDir));
});

// web用htmlの生成
gulp.task('build-web-html', function() {
  // 順序保証で実行
  runSequence('pre-build-polymer-html', 'pre-build-polymer-js', 'pre-build-polymer-css', 'pre-build-peer-js', 'pre-build-components-html', 'exec-build-web-html');
});

// ウォッチャー
gulp.task('build-web-watch', function() {
  gulp.watch(webSassFiles, function(event) {
    gulp.run('build-web-sass');
  });
  gulp.watch(webJsFiles, function(event) {
    gulp.run('build-web-script');
  });
  gulp.watch(webHtmlFiles, function(event) {
    gulp.run('build-web-html');
  });
});

// 全て実行
gulp.task('build-web', ['build-web-sass', 'build-web-script', 'build-web-html']);
