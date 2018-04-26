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

gulp.task('default', ['clean', 'serve'])

gulp.task('serve', ['build', 'watch'], function() {
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
})

gulp.task('watch', function() {
  gulp.watch('src/**/*.html', ['html'])
  gulp.watch('src/**/*.css', ['css'])
  gulp.watch('src/assets/images/**/*', ['images'])
  gulp.watch('src/assets/media/**/*', ['media'])
  gulp.watch('src/assets/scripts/**/*', ['scripts'])
})

gulp.task('build', ['html', 'clean', 'css', 'scripts', 'images', 'media'])

gulp.task('clean', function(cb) {
  return del('dist');
});

gulp.task('html', () =>
  gulp.src('src/*.html')
   .pipe(nunjucks.compile())
   .pipe(gulp.dest(''))
)

gulp.task('images', () =>
  gulp.src('src/assets/images/*')
    .pipe(gulp.dest('dist/images'))
)

gulp.task('media', () =>
  gulp.src('src/assets/media/**/*')
    .pipe(gulp.dest('dist/media'))
)

gulp.task('scripts', () =>
  gulp.src('src/assets/scripts/*')
    .pipe(gulp.dest('dist/scripts'))
)

gulp.task("css", function() {
  var processors = [
    atImport,
    cssnext({
      features: {
        filter: false,
        autoprefixer: false
      }
    }),
  ]
  gulp.src(['src/assets/stylesheets/styles.css'])
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/stylesheets'))
})
