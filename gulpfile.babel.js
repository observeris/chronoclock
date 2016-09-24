//From https://www.npmjs.com/package/vinyl-ftp
//`npm install vinyl-ftp --save-dev` before using
var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var fs = require('fs');
var deploy_config = JSON.parse(fs.readFileSync('./.deploy_config.json'));
// MUST have a following ./.deploy_config.json in your root directory:
// This needs to come from your hosting provide: e.g.:
// https://my.bluehost.com/web-hosting/cplogin?goto_uri=/frontend/bluehost/ftp/accounts.html
/* {
    "host": < FTPHOST > ,
    "user": < FTPUSERNAME >
    "password": < FTP PASSWORD >
} */

gulp.task('ftp-deploy', function() {

  var conn = ftp.create({
    host: deploy_config.host,
    user: deploy_config.user,
    password: deploy_config.password,
    parallel: 1,
    log: gutil.log
  });

  var globs = [
    'assets/**',
    'engine/**',
    'external/**',
    'index.html'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src(globs, {
      base: '.',
      buffer: false
    })
    .pipe(conn.newer('/apps/countdown4d/')) // only upload newer files
    .pipe(conn.dest('/apps/countdown4d/'));

});
