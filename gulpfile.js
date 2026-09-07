var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var postcss = require('gulp-postcss')
var cssnano = require('gulp-cssnano')
var atImport = require('postcss-import')
var cssnext = require('postcss-cssnext')
var browserSync = require('browser-sync').create()
var modRewrite  = require('connect-modrewrite')
var del = require('del');
var debounce = require('lodash/debounce');
var nunjucks = require('gulp-nunjucks')
var debouncedReload = debounce(browserSync.reload, 200)

function clean() {
  return del('dist');
}

function html() {
  return gulp.src('src/*.html')
    .pipe(nunjucks.compile())
    .pipe(gulp.dest('.'))
}

function images() {
  return gulp.src('src/assets/images/*')
    .pipe(gulp.dest('dist/images'))
}

function media() {
  return gulp.src('src/assets/media/**/*')
    .pipe(gulp.dest('dist/media'))
}

function scripts() {
  return gulp.src('src/assets/scripts/*')
    .pipe(gulp.dest('dist/scripts'))
}

function css() {
  var processors = [
    atImport,
    cssnext({
      features: {
        filter: false,
        autoprefixer: false
      }
    }),
  ]
  return gulp.src(['src/assets/stylesheets/styles.css'])
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/stylesheets'))
}

var build = gulp.series(clean, gulp.parallel(html, css, scripts, images, media))

function watchFiles(cb) {
  gulp.watch('src/**/*.html', html)
  gulp.watch('src/**/*.css', css)
  gulp.watch('src/assets/images/**/*', images)
  gulp.watch('src/assets/media/**/*', media)
  gulp.watch('src/assets/scripts/**/*', scripts)
  cb()
}

function serveOnly(cb) {
  browserSync.init({
    server: {
      baseDir: ".",
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    open: false
  });
  gulp.watch('/').on('change', debouncedReload)
  cb()
}

var serve = gulp.series(build, gulp.parallel(watchFiles, serveOnly))

exports.clean = clean
exports.html = html
exports.images = images
exports.media = media
exports.scripts = scripts
exports.css = css
exports.build = build
exports.watch = watchFiles
exports.serve = serve
exports.default = serve
