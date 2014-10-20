/**
 * Desctop Caputure Shareビルドスクリプト
 */

// config
var clientBase = 'client/';
var popupSassFiles = clientBase + 'scss/*.scss';
var popupSassBuildDir = clientBase + 'build/css/';
var popupScriptFiles = ['client/js/class.js', 'client/js/knockout.js', 'client/js/popup.js'];
var popupScriptBuildDir = clientBase + 'build/js/';
var bgScriptFiles = ['client/js/class.js', 'client/js/peer.js', 'client/js/app_peer.js', 'client/js/background.js'];
var bgScriptBuildDir = clientBase + 'build/js/';

var webBase = 'webroot/';
var webSassFiles = webBase + 'scss/*.scss';
var webSassBuildDir = webBase + 'build/css/';


// requires
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


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

// ウォッチャー
gulp.task('build-client-watcher', function() {
  gulp.watch(popupSassFiles, function(event) {
    gulp.run('build-client-popup-sass');
  });
  gulp.watch(popupScriptFiles, function(event) {
    gulp.run('build-client-popup-script');
  });
  gulp.watch(bgScriptFiles, function(event) {
    gulp.run('build-client-bg-script');
  });
});

// 全て実行
gulp.task('build-client', ['build-client-popup-sass', 'build-client-popup-script', 'build-client-bg-script']);


/**
 * web app タスク
 */
// web用cssの生成
gulp.task('build-web-sass', function() {
  gulp.src(webSassFiles)
  .pipe(sass())
  .pipe(gulp.dest(webSassBuildDir))
  .pipe(minifyCss())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest(webSassBuildDir));
});

// ウォッチャー
gulp.task('build-web-watcher', function() {
  gulp.watch(webSassFiles, function(event) {
    gulp.run('build-web-sass');
  });
});

