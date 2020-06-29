const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const { series, parallel } = require('gulp')
const del = require('del')

const resolveDir = (dir) => path.resolve(__dirname, dir)

const clean = (done) => {
  del(resolveDir('./dist'))
  done()
}

const _script = () => {
  return gulp.src(resolveDir('./test.jsx'))
  .pipe(babel({
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-transform-runtime', 
      ["@babel/plugin-proposal-decorators", { "legacy": true }], 
      ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
  }))
  .pipe(gulp.dest('dist'))
}

module.exports.build = series(clean, _script)
