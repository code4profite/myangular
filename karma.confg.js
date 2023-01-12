module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
        'src/**/*.js',
        'test/**/*_spec.js'
    ],
    exclude: [
    ],
    preprocessors: {
        'test/**/*.js': ['jshint'],
        'src/**/*.js': ['jshint']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome','Firefox'],
    singleRun: true,
    concurrency :Infinity,
    singleRun : false
  });
};