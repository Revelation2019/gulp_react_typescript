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


const resolveDir = (dir) => path.resolve(__dirname, dir)

const _path = {
  main_js: resolveDir('./index.js'),
  scss: ['./src/components/**/*.scss'],
}

const clean = (done) => {
  del(resolveDir('./dist'))
  done()
}

const _css = () => {
  return gulp.src(_path.scss)
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./dist/css'))
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
    // .pipe(buffer())
    .pipe(gulp.dest('./dist/js'))
}

const _html = () => {
  return gulp.src(_path.html)
  .pipe(cheerio(($ => {
    $('script').remove()
    $('link').remove()
    $('body').append('<script src="./js/app.js"></script>')
    $('head').append('<link rel="stylesheet" href="./css/app.css">')
  })))
  .pipe(gulp.dest('./dist'))
}

module.exports.build = series(clean, parallel(_script, _css), _html)
