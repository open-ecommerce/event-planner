'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import rimraf   from 'rimraf';
import yaml     from 'js-yaml';
import fs       from 'fs';
import spellcheck from 'gulp-spellcheck';


// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const {COMPATIBILITY, PROXY, PORT, PATHS} = loadConfig();

function loadConfig() {
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
        //gulp.series(clean, gulp.parallel(less, lessbackend, plainscript, fonts, fontsbackend, images)));
        gulp.series(clean, gulp.parallel(less, plainscript, fonts, images)));

// Build the site, run the server, and watch for file changes
gulp.task('default',
        gulp.series('build', server, watch));

// Compress files
gulp.task('img',
        gulp.series(images));

// Watch for file changes
gulp.task('watch',
        gulp.series(watch));

// Watch for file changes
gulp.task('watchadmin',
        gulp.series(watchadmin));


// Compile front end less
gulp.task('less',
        gulp.series(less));

// Compile front end less
gulp.task('lessbackend',
        gulp.series(lessbackend));
        
// EGS spellcheck to se que onda 
gulp.task('spellcheck', function () {
    gulp.src('LICENSE.md')
        .pipe(spellcheck())
        .pipe(gulp.dest('spellchecked'));
});        



// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
    rimraf(PATHS.dist, done);
    // rimraf(PATHS.distbackend, done);
}


// Copy fonts
function fonts() {
    return gulp.src(PATHS.fonts)
            .pipe(gulp.dest(PATHS.dist + '/fonts'));
}


// Mimify and copy images
function images() {
    return gulp.src(PATHS.images)
            .pipe($.imagemin())
            .pipe(gulp.dest(PATHS.dist + '/img'));
}


// Compile Less into CSS
// In production, the CSS is compressed
function less() {
    return gulp.src(PATHS.lessstart)
            .pipe($.less())
            .pipe(gulp.dest(PATHS.dist + '/css'))
            .pipe($.autoprefixer({
                browsers: COMPATIBILITY
            }))
            .pipe($.if(PRODUCTION, $.rename({suffix: '.min'})))
            .pipe($.if(PRODUCTION, $.cssnano()))
            .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
            .pipe(gulp.dest(PATHS.dist + '/css'))
            .pipe(browser.reload({stream: true}));
}


// Compile the backend Less into CSS
// In production, the CSS is compressed
function lessbackend() {
    return gulp.src(PATHS.lessstartbackend)
            .pipe($.less())
            .pipe(gulp.dest(PATHS.distbackend + '/css'))
            .pipe($.autoprefixer({
                browsers: COMPATIBILITY
            }))
            .pipe($.if(PRODUCTION, $.rename({suffix: '.min'})))
            .pipe($.if(PRODUCTION, $.cssnano()))
            .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
            .pipe(gulp.dest(PATHS.distbackend + '/css'))
            .pipe(browser.reload({stream: true}));
}

// Copy fonts
function fontsbackend() {
    return gulp.src(PATHS.fonts)
            .pipe(gulp.dest(PATHS.distbackend + '/fonts'));
}


// Combine Babel (ES6) JavaScript into one file
// In production, the file is minified
function babelscript() {
    return gulp.src(PATHS.babelscript)
            .pipe($.sourcemaps.init())
            .pipe($.babel())
            .pipe($.concat('app.js'))
            .pipe($.if(PRODUCTION, $.rename({suffix: '.min'})))
            .pipe($.if(PRODUCTION, $.uglify()
                    .on('error', e => {
                        console.log(e);
                    })
                    ))
            .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
            .pipe(gulp.dest(PATHS.dist + '/js'));
}

// Combine plain JavaScript (non-ES6) into one file
// In production, the file is minified
function plainscript() {
    return gulp.src(PATHS.plainscript)
            .pipe($.sourcemaps.init())
            .pipe($.concat('app.js'))
            .pipe($.if(PRODUCTION, $.rename({suffix: '.min'})))
            .pipe($.if(PRODUCTION, $.uglify()
                    .on('error', e => {
                        console.log(e);
                    })
                    ))
            .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
            .pipe(gulp.dest(PATHS.dist + '/js'));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
    browser.init({
        logPrefix: "correct link:" + PROXY + "/" + PORT,
        proxy: PROXY,
        port: PORT,
    });
    done();
}


// Watch for changes to static assets, pages, Less, and JavaScript
function watch() {
    gulp.watch(PATHS.fonts, fonts);
    gulp.watch(PATHS.lesswatch, less);
    gulp.watch(PATHS.lesswatchbackend, less);
    gulp.watch(PATHS.js, gulp.series(plainscript, browser.reload));
}

// Watch for changes to static assets, pages, Less, and JavaScript
function watchadmin() {
    gulp.watch(PATHS.lesswatchbackend, less);
}
