var gulp                  = require('gulp');
var sass                  = require('gulp-sass');
// npm i gulp-sass --save-dev
var browserSync           = require('browser-sync').create();
// npm i browser-sync --save-dev
var plumber               = require('gulp-plumber');
// npm install gulp-plumber --save-dev
var cssnano               = require('gulp-cssnano');
// npm install cssnano --save-dev
var notify                = require("gulp-notify");
// npm install gulp-notify --save-dev
var growl                 = require('gulp-notify-growl');
// npm install gulp-notify-growl --save-dev
var autoprefixer          = require('gulp-autoprefixer');
// npm install --save-dev gulp-autoprefixer
var rename                = require('gulp-rename');
// npm install gulp-rename --save-dev
var gulpif                = require('gulp-if');
// npm install gulp-if --save-dev  пока не задействован
var sourcemaps = require('gulp-sourcemaps');
 // npm install gulp-sourcemaps --save-dev
var del                   = require('del');
// npm i del --save-dev
var concat                = require('gulp-concat');
// npm install --save-dev gulp-concat для обьединения js файлов
var uglify                = require('gulp-uglifyjs');
// npm i --save-dev gulp-uglifyjs
var imagemin              = require('gulp-imagemin');
var pngquant              = require('imagemin-pngquant');
// npm i gulp-imagemin imagemin-pngquant --save-dev
var cache                 = require('gulp-cache');
// npm i gulp-cache --save-dev
var spritesmith = require('gulp.spritesmith');
// npm i gulp.spritesmith --save-dev
// три строки переменные для генерации фавикона
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');
var FAVICON_DATA_FILE = 'faviconData.json';
// npm install gulp-real-favicon --save-dev
// переменая которая контролирует создание (true) или отключение (false) карты кода в файле
var isDevelopmant = true;
// переменная для создания шрифтов Iconfont
var runTimestamp      = Math.round(Date.now()/1000);

// все задачи
gulp.task('sass', function () {
return gulp.src('app/scss/**/*.+(scss|sass|css)')
 .pipe(plumber({
     errorHandler: notify.onError({
            message: function(error) {
                return error.message;
            }})
 }))

.pipe(gulpif (isDevelopmant, sourcemaps.init({loadMaps:true})))
.pipe(sass())
.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade:true}))
 // .pipe(cssnano())
.pipe(rename({suffix: '.min'}))
.pipe(gulpif (isDevelopmant, sourcemaps.write(".")))
.pipe(gulp.dest('app/css'))
.pipe(browserSync.stream());
});

gulp.task('css-libs', ['sass'], function () {
    return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
 return gulp.src([
'app/libs/jquery/jquery.min.js',
'app/libs/magnific-popup/jquery.magnific-popup.min.js',
'app/libs/owlcarousel/owl.carousel.min.js',
'app/libs/equalHeights/equalHeights.min.js',
'app/libs/nicescroll/jquery.nicescroll.min.js',
'app/libs/mmenu/jquery.mmenu.all.js',
'app/libs/jquery.PageScroll2id/jquery.PageScroll2id.min.js',
'app/libs/jquery/common.js'
   ])
 .pipe(concat('libs.min.js'))
 // .pipe(uglify())
 .pipe(gulp.dest('app/js'))
 .pipe(browserSync.stream());
});



gulp.task('img', function(){
return gulp.src('app/images/**/*')

.pipe(cache(imagemin({
 intarlaced:true,
 progresive:true,
 svgoPlugins: [{removeViewbox:false}],
 use:[pngquant()],
   optimizationLevel: 3
})))
.pipe(gulp.dest('dist/images'));
});


// таск для того чтобы очишвть кеш картинок(запускать в ручную)
gulp.task('clear', function () {
    return cache.clearAll();
});


gulp.task('browser-sync', ['scripts', 'css-libs'],  function(){
 browserSync.init({
     server:{
         baseDir:'./app'
     },
 open:true,
     notify:false
 });
});


gulp.task('watch', function(){
gulp.watch('app/scss/**/*.scss', ['sass']);
gulp.watch('app/libs/**/*.js', ['scripts']);
gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
gulp.watch('app/css/**/*.css', browserSync.reload);   // Наблюдение за css файлами в папке css
});
gulp.task('default', ['browser-sync', 'watch']);







gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

// сборка проекта
gulp.task('build', ['clean', 'img', 'css-libs', 'scripts'], function(){

var buildCss = gulp.src(['app/css/libs.min.css','app/css/main.min.css'])
.pipe(concat('libs.min.css'))
 // .pipe(cssnano())
.pipe(gulp.dest('dist/css'));

var buildfonts = gulp.src('app/fonts/**/*')
.pipe(gulp.dest('dist/fonts'));

var buildJs = gulp.src('app/js/**/*')
.pipe(gulp.dest('dist/js'));

var buildHtml = gulp.src('app/*.html')
.pipe(gulp.dest('dist/'));

var buildhtml5shiv = gulp.src('app/libs/html5shiv/**/*')
.pipe(gulp.dest('dist/libs/html5shiv'));

});

// ниже размещена команда для ручного создания спрайтов
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/sprites/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.css',
    padding: 120,
    algorithm:'top-down',
    cssTemplate: 'app/sprites.handlebars'
  }));
    spriteData.img.pipe(gulp.dest('app/images/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/sprites/')); // путь, куда сохраняем стили
});

// Generate the icons.
gulp.task('genfav', function(done) {
    realFavicon.generateFavicon({
        masterPicture: 'app/favicon/basic.png',
        dest: 'app/images/favicon/',
        iconsPath: 'images/favicon',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin', //Add a solid, plain background to fill the transparent regions.
                backgroundColor: '#ffffff',
                margin: '14%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'whiteSilhouette', //Use a white silhouette version of the favicon
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#da532c',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#da532c'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

// Inject the favicon markups in your HTML pages.
gulp.task('injectfav', function() {
    return gulp.src(['app/*.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('app'));
});

// Check for updates on RealFaviconGenerator
gulp.task('check-for-favicon-update', function(done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    });
});

// работает для не битых файлов svg если не работает скрипт - замети файл
// gulp.task('Iconfont', function(){
//   return gulp.src(['app/iconsFon/*.svg'])
//     .pipe(iconfont({
//       fontName: 'myfont', // required
//       fontHeight: 1001,
//       normalize:true,
//       prependUnicode: true, // recommended option
//       formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
//       timestamp: runTimestamp, // recommended to get consistent builds when watching files
//     }))
//       .on('glyphs', function(glyphs, options) {
//         // CSS templating, e.g.
//         console.log(glyphs, options);
//       })
//     .pipe(gulp.dest('app/iconsFon/'));
// });


