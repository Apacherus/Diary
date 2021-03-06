//export PATH="$PATH:$HOME/.npm-packages/bin"
//npm install gulp gulp-watch gulp-rename gulp-plumber gulp-autoprefixer run-sequence gulp-uglify gulp-sass gulp-sourcemaps gulp-rigger gulp-minify-css gulp-imagemin imagemin-pngquant browser-sync browserify gulp-react del gulp-replace gulp-zip gulp-css-base64 --save-dev
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    browserify = require('browserify'),
    react = require('gulp-react'),
    del = require('del'),
    replace = require('gulp-replace'),
    zip = require('gulp-zip'),
    plumber = require('gulp-plumber'),
    cssBase64 = require('gulp-css-base64'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    gutil = require("gulp-util"),
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

gulp.task('clean', function (cb) {
    return del(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(rigger())
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
            }
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


gulp.task('js:build-prod', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        //.pipe(browserify())
        //.pipe(reactify)
        .pipe(react())
        //.pipe(sourcemaps.init())
        .pipe(uglify())
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

gulp.task('sass:build-prod', function(){
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass({
            sourceMap:false,
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
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task("style-after-sass:build-prod", function() {
    return;
    return gulp.src(path.dist.tmp.css)
        .pipe(prefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        //.pipe(sourcemaps.init())
        .pipe(cssmin())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task("style:build", function() {
    return gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(prefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(cssBase64({
            maxWeightResource: 50000
        }))
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task("style:build-prod", function() {
    return gulp.src(path.src.style)
        .pipe(prefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(cssBase64({
            maxWeightResource: 50000
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('dist:copy', function(){
    return gulp.src(['dist/**/*.*','!dist/tmp/**/*.*'])
        .pipe(gulp.dest(path.build.base));
});

gulp.task('images:build', function () {
    return gulp.src(path.src.img)
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('images:copy', function(){
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('app-paid-ios', function(cb){
    return gulp.src(['src/index.html','src/index_ru.html'])
        .pipe(replace('_APP_PAID_TYPE_', 'app-paid'))
        .pipe(replace('_APP_PLATFORM_', 'app-iOS'))
        .pipe(gulp.dest('app/iOS/paid'));
});

gulp.task('app-free-ios', function(cb){
    return gulp.src(['src/index.html','src/index_ru.html'])
        .pipe(replace('_APP_PAID_TYPE_', 'app-free'))
        .pipe(replace('_APP_PLATFORM_', 'app-iOS'))
        .pipe(gulp.dest('app/iOS/free'));
});

gulp.task('app-paid-android', function(cb){
    return gulp.src(['src/index.html','src/index_ru.html'])
        .pipe(replace('_APP_PAID_TYPE_', 'app-paid'))
        .pipe(replace('_APP_PLATFORM_', 'app-android'))
        .pipe(gulp.dest('app/android/paid'));
});

var langs = ['ru', 'de', 'it', 'es', 'pl', 'fr', 'cn', 'jp', 'kr', 'pt', 'tr'];
//	RU	EN	DE	IT	ES	PL	FR	CN	JP	KR	PT	TR

gulp.task('app-paid-ios:translation', function(cb){
    for(var i = 0; i < langs.length; i++){
        var result =
            gulp.src(['app/iOS/paid/index.html'])
            .pipe(replace('lang="en"', 'lang="'+langs[i]+'"'))
            .pipe(rename('index_'+langs[i]+'.html'))
            .pipe(gulp.dest('app/iOS/paid/'));
        if(i == langs.length-1){
            return result;
        }
    }
});

gulp.task('app-free-ios:translation', function(cb){
    for(var i = 0; i < langs.length; i++){
        var result =
            gulp.src(['app/iOS/free/index.html'])
            .pipe(replace('lang="en"', 'lang="'+langs[i]+'"'))
            .pipe(rename('index_'+langs[i]+'.html'))
            .pipe(gulp.dest('app/iOS/free/'));
        if(i == langs.length-1){
            return result;
        }
    }
    return true;
});

gulp.task('app-paid-android:translation', function(cb){
    for(var i = 0; i < langs.length; i++){
        var result =
            gulp.src(['app/android/paid/index.html'])
            .pipe(replace('lang="en"', 'lang="'+langs[i]+'"'))
            .pipe(rename('index_'+langs[i]+'.html'))
            .pipe(gulp.dest('app/android/paid/'));
        if(i == langs.length-1){
            return result;
        }
    }
    return true;
});

gulp.task('app-free-android:translation', function(cb){
    for(var i = 0; i < langs.length; i++){
        var result =
            gulp.src(['app/android/free/index.html'])
            .pipe(replace('lang="en"', 'lang="'+langs[i]+'"'))
            .pipe(rename('index_'+langs[i]+'.html'))
            .pipe(gulp.dest('app/android/free/'));
        if(i == langs.length-1){
            return result;
        }
    }
    return true;
});

gulp.task('app-free-android', function(cb){
    return gulp.src(['src/index.html','src/index_ru.html'])
        .pipe(replace('_APP_PAID_TYPE_', 'app-free'))
        .pipe(replace('_APP_PLATFORM_', 'app-android'))
        .pipe(gulp.dest('app/android/free'));
});

gulp.task('zip-android-free', function(){
    return gulp.src('app/android/free/**/*.*')
        .pipe(zip('android-free.zip'))
        .pipe(gulp.dest('app/'));
});

gulp.task('zip-android-paid', function(){
    return gulp.src('app/android/paid/**/*.*')
        .pipe(zip('android-paid.zip'))
        .pipe(gulp.dest('app/'));
});

gulp.task('zip-ios-paid', function(){
    return gulp.src('app/iOS/paid/**/*.*')
        .pipe(zip('iOS-paid.zip'))
        .pipe(gulp.dest('app/'));
});

gulp.task('zip-ios-free', function(){
    return gulp.src('app/iOS/free/**/*.*')
        .pipe(zip('iOS-free.zip'))
        .pipe(gulp.dest('app/'));
});


gulp.task('ios-free-copy', function(){
    return gulp.src('build/**/*.*')
        .pipe(gulp.dest('app/iOS/free'));
});


gulp.task('ios-paid-copy', function(){
    return gulp.src('build/**/*.*')
        .pipe(gulp.dest('app/iOS/paid'));
});

gulp.task('android-free-copy', function(){
    return gulp.src('build/**/*.*')
        .pipe(gulp.dest('app/android/free'));
});


gulp.task('android-paid-copy', function(){
    return gulp.src('build/**/*.*')
        .pipe(gulp.dest('app/android/paid'));
});

gulp.task('pre-build', function(cb){
    runSequence('clean', 'build', cb);
});

gulp.task('paid', function(cb){
    runSequence('clean', 'build-prod', 'app-paid', cb);
});

gulp.task('free', function(cb){
    runSequence('clean', 'build-prod', 'app-free', cb);
});

gulp.task('build', [
    'data:build',
    'html:build',
    'js:build',
    'sass:build',
    'style-after-sass:build',
    'style:build',
    'fonts:build',
    'dist:copy',
    'webserver',
    'watch'
]);

gulp.task('build-prod', [
    'data:build',
    'html:build',
    'js:build-prod',
    'sass:build-prod',
    'style-after-sass:build-prod',
    'style:build-prod',
    'fonts:build',
    'dist:copy'
]);

gulp.task('zip', [
    'zip-android-free',
    'zip-android-paid',
    'zip-ios-free',
    'zip-ios-paid'
]);

gulp.task('build-prod-ios-free', function(cb){
    return runSequence('build-prod', 'ios-free-copy', 'app-free-ios',  cb);
});

gulp.task('build-prod-ios-paid', function(cb){
    return runSequence('build-prod', 'ios-paid-copy', 'app-paid-ios',  cb);
});

gulp.task('build-prod-android-free', function(cb){
    return runSequence('build-prod', 'android-free-copy', 'app-free-android',  cb);
});

gulp.task('build-prod-android-paid', function(cb){
    return runSequence('build-prod', 'android-paid-copy', 'app-paid-android',  cb);
});

gulp.task('translations', function(cb){
    return runSequence(['app-paid-ios:translation','app-free-ios:translation','app-paid-android:translation','app-free-android:translation'], cb)
});

gulp.task('prod', function(cb){
    return runSequence('clean', 'build-prod-ios-free','build-prod-ios-paid','build-prod-android-free','build-prod-android-paid', 'translations', 'zip',cb);
});


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch(['./src/css/**/*.scss'], function(event, cb) {
        gulp.start('sass:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.data], function(event, cb) {
        gulp.start('data:build');
    });
    watch([path.dist.base], function(event, cb) {
        gulp.start('dist:copy');
    });
});


gulp.task('default', ['pre-build']);
gulp.task('prodX', ['build-prod']);