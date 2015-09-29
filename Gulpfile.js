var version = 1;

var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var connect = require('gulp-connect');

gulp.task('build-css', function() {
    gulp.src('assets/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('assets/css/source'))
        .pipe(gulp.dest('_site/assets/css/source'))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('assets/css/'))
        .pipe(gulp.dest('_site/assets/css/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/css/'))
        .pipe(gulp.dest('_site/assets/css/'))
        .pipe(connect.reload());
});

gulp.task('build-js', function() {
    gulp.src(['assets/js/source/*.js','!assets/js/jquery.min.js'])
        .on("error",function(error){

            console.log(error);
        })
        .pipe(concat('all.js'))
        // .pipe(gulp.dest('assets/js'))
        // .pipe(gulp.dest('_site/assets/js'))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest('assets/js/'))
        .pipe(gulp.dest('_site/assets/js/'))
        .pipe(connect.reload());
    gulp.src(['assets/js/control.js'])
        .on("error",function(error){

            console.log(error);
        })
        .pipe(gulp.dest('assets/js'))
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/'))
        .pipe(gulp.dest('_site/assets/js/'))
        .pipe(connect.reload());
});

gulp.task('default', function() {
    connect.server({
        root: '_site',
        livereload: true,
        port: 4000
    });
 
   gulp.watch(['assets/js/source/*.js','assets/js/control.js'], ['build-js']);
   gulp.watch('assets/less/*.less', ['bulid-css']);

   gulp.run('build-js');
   gulp.run('bulid-css');
});