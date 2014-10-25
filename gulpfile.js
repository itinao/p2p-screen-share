/**
 * Desctop Caputure Shareビルドスクリプト
 */

// config
// *** chromeの拡張機能
var clientBase = 'client/';
var popupSassFiles = clientBase + 'scss/*.scss';
var popupSassBuildDir = clientBase + 'build/css/';
var popupScriptFiles = ['client/js/class.js', 'client/js/knockout.js', 'client/js/popup.js'];
var popupScriptBuildDir = clientBase + 'build/js/';
var bgScriptFiles = ['client/js/class.js', 'client/js/peer.js', 'client/js/app_peer.js', 'client/js/background.js'];
var bgScriptBuildDir = clientBase + 'build/js/';
var clientHtmlFiles = clientBase + 'html/*.html';
var clientHtmlBuildDir = clientBase + 'build/html/';

// *** webroot側
var webBase = 'webroot/';
var webSassFiles = webBase + 'scss/*.scss';
var webSassBuildDir = webBase + 'build/css/';
var webHtmlFiles = webBase + '*.html';
var webHtmlBuildDir = webBase + 'build/html/';


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
  gulp.src(webSassFiles)
  .pipe(sass())
  .pipe(gulp.dest(webSassBuildDir))
  .pipe(minifyCss())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest(webSassBuildDir));
});

// polymer関連のファイルは最初にminifyしておく
gulp.task('pre-build-web-html', function (done) {
  // {spare: false, empty: true}にしないとpolymerのLayout機能と折り合わない
  var minifyHtmlOption = {comments: false, quotes: true, spare: false, empty: true};

  // polymer関連のファイルは最初にminifyしておく
  gulp.src(['webroot/vendors/polymer/**/*.html'])
  .pipe(minifyInline())
  .pipe(minifyHtml(minifyHtmlOption))
  .pipe(gulp.dest('webroot/build/vendors/polymer/'));

  gulp.src(['webroot/components/*.html'])
  .pipe(minifyInline())
  .pipe(minifyHtml(minifyHtmlOption))
  .pipe(gulp.dest('webroot/build/components/'));

  gulp.src(['webroot/vendors/polymer/**/*.js', 'webroot/vendors/polymer/**/*.js.map'])
  .pipe(gulp.dest('webroot/build/vendors/polymer/'));

  gulp.src(['webroot/vendors/peerjs/*.js'])
  .pipe(gulp.dest('webroot/build/vendors/peerjs/'));

  gulp.src(['webroot/vendors/polymer/**/*.css'])
  .pipe(minifyCss())
  .pipe(gulp.dest('webroot/build/vendors/polymer/'));

  setTimeout(function() {// TODO: バラしてreturnで管理すればtimeoutまたないでもよい
    done();
  }, 10000);
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
  runSequence('pre-build-web-html', 'exec-build-web-html');
});

// ウォッチャー
gulp.task('build-web-watch', function() {
  gulp.watch(webSassFiles, function(event) {
    gulp.run('build-web-sass');
  });
});

// 全て実行
gulp.task('build-web', ['build-web-sass', 'build-web-html']);





