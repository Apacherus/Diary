//export PATH="$PATH:$HOME/.npm-packages/bin"
//npm install gulp gulp-watch gulp-rename gulp-plumber gulp-autoprefixer run-sequence gulp-uglify gulp-sass gulp-sourcemaps gulp-rigger gulp-minify-css gulp-imagemin imagemin-pngquant browser-sync browserify gulp-react del gulp-replace gulp-zip gulp-css-base64 --save-dev
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    cssBase64 = require('gulp-css-base64'),
    gutil = require("gulp-util"),
    webpackBase = require('webpack'),
    uglify = require('gulp-uglify'),
    webpack = require("gulp-webpack");

var path = {
    build: {
        base:'build',
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        data:'build/data'
    },
    dist: {
        tmp:{
            css: 'dist/tmp/css'
        },
        js: 'dist/js',
        css: 'dist/css',
        img: 'dist/img',
        dist: ['dist/js', 'dist/css', 'dist/img'],
        base: 'dist'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        style:  'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        data: 'src/data/**/*.*',
        sass: 'src/sass/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        data: 'src/data/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
};

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});



var data = function () {
    gulp.src(path.src.data)
        .pipe(gulp.dest(path.build.data))
        .pipe(reload({stream: true}));
};

gulp.task('data:build', data);

gulp.task('js:build', function () {
    gulp.src('src/js/app.js')
        .pipe(plumber())
        //.pipe(rigger())
        //.pipe(browserify())
        //.pipe(reactify)
        //.pipe(sourcemaps.init())
        .pipe(webpack({
            output: {
                //path: "./www/",
                filename: "app.js"
            },
            devtool: "#inline-source-map",
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
                ]
            },
            plugins: [
                new webpackBase.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
            ]
        }, null, function(err, stats) {
            if(err) {
                throw new gutil.PluginError("webpack", err);
            }
            gutil.log("[webpack]", stats.toString())
        }))
        //.pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});




gulp.task('sass:build', function(){
    return gulp.src('./src/css/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
            sourceMap:true,
            errLogToConsole: true
        }))
        .pipe(prefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(cssBase64({
            maxWeightResource: 50000
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream:true}));
});


gulp.task("style-after-sass:build", function() {
    return;
    return gulp.src(path.dist.tmp.css)
        .pipe(plumber())
        .pipe(prefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});



gulp.task('dist:copy', function(){
    return gulp.src(['dist/**/*.*','!dist/tmp/**/*.*'])
        .pipe(gulp.dest(path.build.base));
});


gulp.task('images:copy', function(){
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});



gulp.task('build', [
    'data:build',
    'html:build',
    'js:build',
    'sass:build',
    'style-after-sass:build',
    'dist:copy',
    'webserver',
    'watch'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });

    watch(['./src/css/**/*.scss'], function(event, cb) {
        gulp.start('sass:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images:copy');
    });

    watch([path.watch.data], function(event, cb) {
        gulp.start('data:build');
    });
    watch([path.dist.base], function(event, cb) {
        gulp.start('dist:copy');
    });
});


gulp.task('default', ['build']);