const gulp = require('gulp');
const util = require('gulp-util');
// const  concat = require('gulp-concat');
// const  browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const print = require('gulp-print');

const fs = require('fs');
const path = require('path');
const merge = require('merge-stream');

const env = process.env.NODE_ENV || 'development';

util.log("ENV === '" + env + "'");

const kBabelSourcesRegexp = '/**/*.es6';
const kBabelDestinationExtension = '.js';

/**
 * A wrapper that prevents an error from stopping a watch
 * @param {error} error to print out.
 * (per http://stackoverflow.com/questions/23971388/prevent-errors-from-breaking-crashing-gulp-watch)
 */
function swallowError(error) {

    util.log("BABEL ERROR:" + error.toString());

    this.emit('end');
}

/**
 * Gets all the folders in a current folder, synchronously
 * @param {String} dir : current folder
 * @return {Array} array of directory names
 */
function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

/**
 * Gets all the source folders in iBabelSourcePath, including './'
 * @param {String} iBabelSourcePath, root of a tree to scan
 * @return {Array} array of subfolders' basenames
 */
function getBabelSourceFolders(iBabelSourcePath) {
    const folders = getFolders(iBabelSourcePath);
    folders.push("./");
    return folders;
}

/**
 * Run the babel tasks on all *.es6 files in the directory,
 * replicating the folder structure in the destination directory
 * @param {String} iBabelSourcePath, root of a tree to scan
 * @param {String} iBabelDestinationPath, destination path
 * @return {Array} array of subfolders' basenames
 */
function babelFolderTree(iBabelSourcePath, iBabelDestinationPath) {

    const babelFileLogPrintFunction = function(filepath) {
        return "Babel Transcoding ES6: " + filepath;
    };

    const babelDestination = function(filepath) {
        return "Babel Result JS is at : " + filepath;
    };

    const tasks = getBabelSourceFolders(iBabelSourcePath).map(function(iFolder) {

        // See .babelrc for babel() configuration, we use es2015 profile.

        return gulp.src(path.join(iBabelSourcePath, iFolder, kBabelSourcesRegexp))
            .pipe(print(babelFileLogPrintFunction))
            .pipe(babel().on('error', swallowError))
            .pipe(rename(function(path) {
                // path.basename += "-babelprocessed";
                path.extname = kBabelDestinationExtension;
                return path;
            }))
            .pipe(gulp.dest(path.join(iBabelDestinationPath, iFolder)))
            .pipe(print(babelDestination));
    });

    return merge(tasks);

}
/**
 * Put the directory structure in an array, for a gulp watch task
 * @param {String} iBabelSourcePath, root of a tree to scan
 * @return {Array} array of subfolders' full path names + es6 regexp search, to feed into gulp.watch()
 */
function babelSourceFolderArray(iBabelSourcePath) {
    const foldersWatchArray = [];

    getBabelSourceFolders(iBabelSourcePath).forEach(function(iFolder) {
        foldersWatchArray.push(path.join(iBabelSourcePath, iFolder, kBabelSourcesRegexp));
    });

    return foldersWatchArray;
}

const kBabelSourcePath = "engine-es6";
const kBabelDestinationPath = "engine";

gulp.task("babel", () => {
    babelFolderTree(kBabelSourcePath, kBabelDestinationPath);
});

gulp.task("watch", () => {
    // livereload.listen();
    gulp.watch(babelSourceFolderArray(kBabelSourcePath), ['babel']);
});

gulp.task('default', ['babel', 'watch']);
