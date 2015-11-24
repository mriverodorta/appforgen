module.exports = function () {
  var conf = {
    environment: 'development',
    ts: {
      client: {
        filename: 'app.js',
        source: 'source/client',
        dest: 'dist/client/',
        destFile: 'dist/client/app.js',
        destTmp: 'tmp/client/',
        tmpFile: 'tmp/app.js'
      },
      server: {
        source: './source/server/**/*.ts',
        dest: ''
      }
    },
    templates: {
      source: 'source/client/**/*.tpl.jade',
      cacheConfig: {
        module: 'appforgen.templates',
        standalone: true,
        moduleSystem: 'IIFE',
        transformUrl: function(url) {
          return url.replace(/app\//g, '').replace(/\.tpl\.html$/, '.html');
        }
      }
    }
  }
  return conf;
}