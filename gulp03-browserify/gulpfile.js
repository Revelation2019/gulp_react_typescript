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

const resolveDir = (dir) => path.resolve(__dirname, dir)

const clean = (done) => {
  del(resolveDir('./dist'))
  done()
}

const _script = () => {
  return browserify('./index.js')
    .transform("babelify", {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-transform-runtime', 
        ["@babel/plugin-proposal-decorators", { "legacy": true }], 
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
      ]
    })
    .bundle()
    .pipe(source('app.js'))
    // .pipe(buffer())
    .pipe(gulp.dest('dist'))
}

module.exports.build = series(clean, _script)
