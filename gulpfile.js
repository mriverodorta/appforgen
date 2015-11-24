var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var path = require('path');
var cp = require('child_process');
var del = require('del');
var wiredep = require('wiredep');


var config = require('./gulp.config')();
var envDev = ((config.environment || process.env.NODE_ENV || 'development')
  .trim().toLowerCase() !== 'production');

var buildTasks = [
  'build-vendors-js',
  // 'build-app-ts-client',
  'concat-client-ts-from-temp',
  'compile-templates'
]


gulp.task('default', function (done) { });

/**
 * Clean Temporary an Distribution files
 */
gulp.task('clean', function(done){
  del(['./tmp', './dist'])
    .then(function (paths) {
      console.log('Deleted folder and files:\n', paths.join('\n'));
      done();
    });
});

/**
 * Compile Templates
 */
gulp.task('compile-templates', function(){
  return gulp.src(config.templates.source)
    .pipe($.plumber())
    .pipe($.jade())
    .pipe($.angularTemplatecache('templates.js', config.templates.cacheConfig))
    .pipe(gulp.dest('tmp'));
});

/**
 * Compile Vendors JS to tmp
 */
gulp.task('build-vendors-js', function () {
  var js = wiredep()['js'];
  return gulp.src(js)
    .pipe($.plumber())
    .pipe($.concat('vendors.js'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('build-app-ts-client', function(done){
  compileClientTs(done);
});

gulp.task('build-app-ts-client-dir', function(done){
  compileClientTsDir(done);
});

gulp.task('concat-client-ts-from-temp', ['build-app-ts-client-dir'], function () {
  return gulp.src(config.ts.client.destTmp + '**/*.js')
    .pipe($.deporder())
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('build', buildTasks, function(){
  return gulp.src(['tmp/vendors.js', 'tmp/app.js', 'tmp/templates.js'])
    .pipe($.concat('app.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.ts.client.dest));
})

/**
 * Watch TypeScript and recompile
 */
gulp.task('tsc-watcher', ['tsc-watcher-client', 'tsc-watcher-server']);

gulp.task('ts-watcher-client', function () {
  gulp.watch(config.ts.client.source, ['tsc-client']);
});

gulp.task('tsc-watcher-server', function () {
  gulp.watch(config.ts.server.source, ['tsc-server']);
});

/**
 * Compile All ts files
 */
gulp.task('tsc', ['tsc-client', 'tsc-server']);

/**
 * Compile Client ts Files
 */
gulp.task('tsc-client', function (done) {
  var dest = envDev ? config.ts.client.destFile : config.ts.client.tmpFile;
  runTSC('source/client', dest, true, done);
});

/**
 * Compile Server ts Files
 */
gulp.task('tsc-server', function (done) {
  runTSC('source/server', 'dist/server', false, done);
});









/*******************************************************************************
 *                              HELPER FUNCTIONS                               *
 ******************************************************************************/

function runTSC(src, dest, concat, done) {
  var tscjs = path.join(process.cwd(), 'node_modules/typescript/bin/tsc');
  var options = [tscjs, '-p', src];
  if (concat) {
    options.push('--outFile');
  } else {
    options.push('--outdir');
  }
  options.push(dest);

  var childProcess = cp.spawn('node', options, { cwd: process.cwd() });
  childProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  childProcess.on('close', function () {
    if (!envDev) {
      gulp.src(dest)
        .pipe($.uglify())
        .pipe(gulp.dest(config.ts.client.dest));
      }
      done();
  });
}

function compileClientTs(done){
  var tscjs = path.join(process.cwd(), 'node_modules/typescript/bin/tsc');
  var options = [
    tscjs,
    '-p',
    config.ts.client.source,
    '--outFile',
    config.ts.client.tmpFile
  ];

  var childProcess = cp.spawn('node', options, { cwd: process.cwd() });
  childProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  childProcess.on('close', function () {
    done();
  });
}

function compileClientTsDir(done){
  var tscjs = path.join(process.cwd(), 'node_modules/typescript/bin/tsc');
  var options = [
    tscjs,
    '-p',
    config.ts.client.source,
    '--outDir',
    config.ts.client.destTmp
  ];

  var childProcess = cp.spawn('node', options, { cwd: process.cwd() });
  childProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });
  childProcess.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  childProcess.on('close', function () {
    done();
  });
}