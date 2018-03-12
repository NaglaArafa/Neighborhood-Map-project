var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReaplce = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

var config = {
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/**/*.css',
    jsin: 'src/js/app/*.js',
    imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'src/*.html',
    scssin: 'src/scss/**/*.scss',
    cssout: 'dist/css/',
    jsout: 'dist/js/',
    jspout: 'src/js/lib',
    imgout: 'dist/img/',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'style.css',
    csspoutname:'plugin.css',
    jsoutname: 'script.js',
    jspoutname: 'plugins.js',
    cssreplaceout: 'css/style.css',
    jspreplaceout: 'js/plugins.js',
    jsreplaceout: 'js/script.js',
    jsPlugins: [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/knockout/build/output/knockout-latest.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ], 
    cssPlugin:[
        'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ],
    jsonsrc:'src/*.json',
    jsondist:'dist'
};

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('serve', ['sass','cssPlugin', 'jsPlugins', 'js'], function() {
    browserSync({
        server: config.src
    });

    gulp.watch([config.htmlin, config.jsin], ['reload']);
    gulp.watch(config.scssin, ['sass']);
});

gulp.task('sass', function() {
    return gulp.src(config.scssin)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.scssout))
        .pipe(browserSync.stream());
});
gulp.task('cssPlugin', function() {
    return gulp.src(config.cssPlugin)
        .pipe(concat(config.csspoutname))
        .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
        .pipe(gulp.dest(config.scssout))
        .pipe(gulp.dest(config.cssout));
});
gulp.task('css', function() {
    return gulp.src(config.cssin)
        .pipe(concat(config.cssoutname))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.cssout));
});
gulp.task('js', function() {
    return gulp.src(config.jsin)
        .pipe(concat(config.jsoutname))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsout));
});
gulp.task('jsPlugins', function() {
    return gulp.src(config.jsPlugins)
        .pipe(concat(config.jspoutname))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsout))
        .pipe(gulp.dest(config.jspout));
});

gulp.task('img', function() {
    return gulp.src(config.imgin)
        .pipe(changed(config.imgout))
        .pipe(imagemin())
        .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function() {
    return gulp.src(config.htmlin)
        .pipe(htmlReaplce({
            // 'css': config.cssreplaceout,
            'js': [config.jspreplaceout, config.jsreplaceout]
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.dist));
});
gulp.task('json', function() {
    return gulp.src(config.jsonsrc)
        .pipe(gulp.dest(config.jsondist));
});

gulp.task('clean', function() {
    return del([config.dist]);
});

gulp.task('build', function() {
    sequence('clean', ['html', 'jsPlugins', 'js','cssPlugin', 'css', 'img','json']);
});

gulp.task('default', ['serve']);