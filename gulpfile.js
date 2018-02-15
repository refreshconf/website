var browserslist = require('browserslist');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var cssnano = require('gulp-cssnano');
var atImport = require('postcss-import');
var lost = require('lost');
var cssnext = require('postcss-cssnext');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var browsersync = require('browser-sync');
var imagemin = require('gulp-imagemin');
var jpegoptim = require('imagemin-jpegoptim');

// Browsers for which autoprefix will add prefixes
var browsers = 'last 2 versions';

var dest = './dist';

var sassSrc = './assets/stylesheets/styles.scss';
var sassDest = './dist/stylesheets';
var sassGlob = './assets/stylesheets/**/*.scss';

var imagesDest = './dist/images';
var imagesGlob = './assets/images/**/*';
var imagesOptimizationLevel = 5;

// Compile CSS
gulp.task('css', function() {
  var processors = [
    atImport,
    cssnext(),
    lost(),
  ];

  return gulp.src(['assets/stylesheets/styles.css', 'assets/stylesheets/pattern-library.css'])
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/stylesheets'));
});

// Images - gif, jpeg, png and svg
gulp.task('images', function() {

  if (gutil.env.type === 'production') {
    return gulp.src(imagesGlob)
      .pipe(imagemin({
        optimizationLevel: imagesOptimizationLevel,
        progressive: true,
        interlaced: true,
        multipass: true,
        use: [jpegoptim({ max: 80 })],
      }))
      .pipe(gulp.dest(imagesDest));
  } else {
    return gulp.src(imagesGlob)
      .pipe(gulp.dest(imagesDest));
  }
});

// Watch
gulp.task('watch', function() {
  watch(sassGlob, function() {
    gulp.start('css');
  });

  watch(imagesGlob, function() {
    gulp.start('images');
  });

  watch(['./**/*.html'], function() {
    browsersync.reload();
  });
});

// Clean
gulp.task('clean', function(cb) {
  return del([dest]);
});

// Display browsers
gulp.task('browserslist', ['clean'], function() {
  console.log(browserslist(browsers));
});

gulp.task('default', function() {
  if (gutil.env.type === 'production') {
    gulp.start('css');
    gulp.start('images');
  } else {
    gulp.start('watch');
    gulp.watch('assets/stylesheets/*.css', ['css']);
  }
  gulp.start('images');
});
