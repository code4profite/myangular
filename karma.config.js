module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify','jasmine'],
    files: [
        'src/**/*.js',
        'test/**/*_spec.js'
    ],
    exclude: [
    ],
    preprocessors: {
        'test/**/*.js': ['jshint','browserify'],
        'src/**/*.js': ['jshint','browserify']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome','Firefox'],
    browserify:
    { 
      debug:true,
      bundleDelay: 2000
    }, 
    singleRun: true,
    concurrency :Infinity,
    singleRun : false,

  });
};