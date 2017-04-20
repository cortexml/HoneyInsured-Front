// Include gulp
var gulp = require('gulp');

// Include plugins
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var minifyHTML = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var path = require('path');
var rename = require("gulp-rename");
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer')
var uncss = require('gulp-uncss');
var cssimport = require("gulp-cssimport");
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var clean = require('gulp-clean');
var fileinclude = require('gulp-file-include');
var importCss = require('gulp-import-css');

gulp.task('css', function() {
  gulp.src('dist/css/*.css').pipe(importCss()).pipe(minifyCss({
    compatibility : 'ie8'
  })).pipe(gulp.dest('dist/css'));
});

gulp.task('compress-img', function() {
  return gulp.src('dist/img/*').pipe(imagemin({
    progressive : true,
    svgoPlugins : [{
      removeViewBox : false
    }],
    use : [pngquant()]
  })).pipe(gulp.dest('dist/img'));
});

gulp.task('compress-js', function() {
  return gulp.src(['dist/js/*.js', 'dist/js/*min.js']).pipe(uglify()).pipe(gulp.dest('dist/js'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals : true,
    spare : true,
    quotes : true,
    cdata : true,
    empty : true,
    loose : true,
  };

  return gulp.src('./dist/*.html').pipe(minifyHTML(opts)).pipe(gulp.dest('./dist/'));
});

gulp.task('less', function() {
  return gulp.src('./app/css/*.less').pipe(less({
    paths : [path.join(__dirname, 'less', 'includes')]
  })).pipe(autoprefixer({
    browsers : ['> 5%'],
    cascade : false
  })).pipe(rename({
    prefix : "generated-",
  })).pipe(gulp.dest('./app/css'));
});

gulp.task('clean-template', function() {
  // clean folder
  gulp.src('.generated-html/*', {
    read : false
  }).pipe(clean());
});

gulp.task('copy-template', function() {
  // pump template
  gulp.src(['app/html/**/*.html', '!app/html/layouts/**/*.html', '!app/html/partials/**/*.html']).pipe(fileinclude({
    prefix : '@@',
    basepath : '@file'
  })).pipe(gulp.dest('.generated-html'));
});

gulp.task('blog-template', function() {
  gulp.src(['app/blog/*.html']).pipe(fileinclude({
    prefix : '@@',
    basepath : '@file'
  })).pipe(rename({
    prefix : "blog_",
  })).pipe(gulp.dest('.generated-html'));
});

gulp.task('template', ['copy-template','blog-template']);

gulp.task('watch', function() {
  browserSync({
    notify : false,
    port : 9000,
    server : {
      baseDir : ['.generated-html', 'app'],
      routes : {
        '/bower_components' : 'bower_components'
      }
    }
  });
  // watch for changes
  gulp.watch('./app/css/*.less', ['less']);
  gulp.watch(['./app/html/**/*.html', './app/blog/**/*.html'], ['template']);
  gulp.watch(['.generated-html/**/*.html', 'app/js/**/*.js', 'app/css/*.css', 'app/img/**/*']).on('change', reload);
});

gulp.task('dist', function() {
  browserSync({
    notify : false,
    port : 9000,
    server : {
      baseDir : ['dist']
    }
  });
});

gulp.task('default', ['less', 'template', 'watch']);
