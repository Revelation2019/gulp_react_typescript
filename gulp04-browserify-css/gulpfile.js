const path = require('path')
const gulp = require('gulp')
const babelify = require('babelify')
const browserify = require('browserify')  // 插件,
    // 转成stream流，gulp系
const source = require('vinyl-source-stream')
    // 转成二进制流，gulp系
const buffer = require('vinyl-buffer')
const { series, parallel } = require('gulp')
const del = require('del')
const concat = require('gulp-concat')


const resolveDir = (dir) => path.resolve(__dirname, dir)

const _path = {
  main_js: resolveDir('./index.js'),
  css: ['./src/components/**/*.css']
}

const clean = (done) => {
  del(resolveDir('./dist'))
  done()
}

const _css = () => {
  return gulp.src(_path.css)
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

module.exports.build = series(clean, parallel(_script, _css))
