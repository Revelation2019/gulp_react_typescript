const path = require('path')
const gulp = require('gulp')
const react = require('gulp-react')
const { series, parallel } = require('gulp')
const del = require('del')

const resolveDir = (dir) => path.resolve(__dirname, dir)

const clean = (done) => {
  del(resolveDir('./dist'))
  done()
}

const _script = () => {
  return gulp.src(['./src/components/Test/Test.jsx', './src/App.jsx', './index.js'])
  .pipe(react({
    es6module: true
  }))
  .pipe(gulp.dest('./dist'))
}

module.exports.build = series(clean, _script)
