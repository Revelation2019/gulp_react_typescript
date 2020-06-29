const path = require('path')
const gulp = require('gulp')
const babelify = require('babelify')
const browserify = require('browserify')
    // 转成stream流，gulp系
const source = require('vinyl-source-stream')
    // 转成二进制流，gulp系
const buffer = require('vinyl-buffer')
const { series, parallel } = require('gulp')
const del = require('del')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const cheerio = require('gulp-cheerio')
const uglify = require('gulp-uglify')
const cssmin = require('gulp-cssmin')
const minifyHtml = require('gulp-minify-html')
const rename = require('gulp-rename')
const resversion = require('gulp-res-version')
const connect = require('gulp-connect')

const resolveDir = (dir) => path.resolve(__dirname, dir)
const PORT = process.env.PORT || 8080

const _path = {
  main_js: './index.js',
  js: ['./index.js', './src/*.jsx', './src/**/**/*.jsx'],
  scss: ['./src/components/**/*.scss'],
  html: './index.html'
}

const clean = (done) => {
  del('./dist')
  done()
}

const _css = () => {
  return gulp.src(_path.scss)
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload())
}

const _script = () => {
  return browserify({
      entries: _path.main_js,
      transform: [babelify.configure({
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
          '@babel/plugin-transform-runtime', 
          ["@babel/plugin-proposal-decorators", { "legacy": true }], 
          ["@babel/plugin-proposal-class-properties", { "loose": true }]
        ]
      })]
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload())
}

const _html = () => {
  return gulp.src(_path.html)
  .pipe(cheerio(($ => {
    $('script').remove()
    $('link').remove()
    $('body').append('<script src="./js/app.min.js"></script>')
    $('head').append('<link rel="stylesheet" href="./css/app.min.css">')
  })))
  .pipe(minifyHtml({
    empty: true,
    spare: true
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(connect.reload())
}

const _rev = () => {
  return gulp.src('./dist/*.html')
    .pipe(resversion({
      rootdir: './dist/',
      ignore: [/#data$/i]
    }))
    .pipe(gulp.dest('./dist'))
}

const _server = () => {
  connect.server({
    root: 'dist',
    port: PORT,
    livereload: true
  })
}

const _watch = () => {
  gulp.watch(_path.html, _html)
  gulp.watch(_path.js, _script)
  gulp.watch(_path.scss, _css)
}

module.exports = {
  build: series(clean, parallel(_script, _css, _html), _rev, parallel(_server, _watch)),
  dev: series(clean, parallel(_script, _css, _html), _rev, parallel(_server, _watch))
}
