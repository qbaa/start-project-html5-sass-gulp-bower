var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    series = require('stream-series'),    
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin');

var paths = {
    jsDir: 'app/js/',
    cssDir: 'app/css/',
    fontsDir: 'app/fonts/',
    bowerDir: 'bower_components/',
};

var files = {
    scripts: [
        paths.jsDir + 'jquery.js',
        paths.jsDir + 'bootstrap.js',
        paths.jsDir + 'slick.js',
        paths.jsDir + 'addons.js',
    ],
    css: [
        paths.cssDir + 'normalize.css',
        paths.cssDir + 'bootstrap.css',
        paths.cssDir + 'bootstrap-theme.css',
        paths.cssDir + 'slick.css',
        paths.cssDir + 'slick-theme.css',
        paths.cssDir + 'style.css',
    ]
};

gulp.task('bower', function() {
    // js
    gulp.src([
        paths.bowerDir + 'jquery/dist/jquery.js',
        paths.bowerDir + 'bootstrap/dist/js/bootstrap.js',
        paths.bowerDir + 'slick-carousel/slick/slick.js'
    ])
   .pipe(gulp.dest(paths.jsDir));

   // css
    gulp.src([
        paths.bowerDir + 'normalize-css/normalize.css',
        paths.bowerDir + 'bootstrap/dist/css/bootstrap.css',
        paths.bowerDir + 'bootstrap/dist/css/bootstrap-theme.css',
        paths.bowerDir + 'slick-carousel/slick/slick.css',
        paths.bowerDir + 'slick-carousel/slick/slick-theme.css',
    ])
   .pipe(gulp.dest(paths.cssDir));

   // fonts
    gulp.src([
        paths.bowerDir + '/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eof,eot,svg,otf}'
    ])
   .pipe(gulp.dest(paths.fontsDir));
   
});

// browserSync task
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app',
        },
        // Proxy, when you have application on other address
        //proxy: {
        //    target: "http://yourlocal.dev",
        //}
    });
});

//optimization images
gulp.task('images', () =>
    gulp.src('app/img/*')
    	.pipe(gulp.dest('app/img/src'))
        .pipe(imagemin())
        .pipe(gulp.dest('app/img'))
);

// sass task
gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass())
        .on("error", notify.onError(function(error) {
            return "Error: " + error.message;
        }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css')).pipe(browserSync.reload({
            stream: true
        }));
});

// insert task for development 
gulp.task('insert:dev', function() {

    // get js files
    var insert_js_dev = gulp.src(files.scripts, { read: false });

    // get css files
    var insert_css_dev = gulp.src(files.css, { read: false });

    return gulp.src('app/*.html')
        .pipe(inject(series(insert_js_dev, insert_css_dev), {
            starttag: '<!-- insert:{{ext}} -->',
            endtag: '<!-- endinsert -->',
            relative: true
        }))
        .pipe(gulp.dest('app'));
});

// insert task for production 
gulp.task('insert:prod', function() {

    // concat and uglify js files
    var insert_js_prod = gulp.src(files.scripts)
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('app/js'));

    // concat and minify css files
    var insert_css_prod = gulp.src(files.css)
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('app/css'));

    return gulp.src('app/*.html')
        .pipe(inject(series(insert_js_prod, insert_css_prod), {
            starttag: '<!-- insert:{{ext}} -->',
            endtag: '<!-- endinsert -->',
            relative: true
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// default task
gulp.task('default', ['watch']);

gulp.task('dev', ['insert:dev']);
gulp.task('prod', ['insert:prod']);
