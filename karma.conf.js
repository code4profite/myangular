module.exports = async (config) => {
  const karmaConfig = await getKarmaConfig(config);
  config.set({
    ...karmaConfig,
  });
};

function getKarmaConfig(config){
  return {
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
    reporters: ['progress',/*,'mocha',*/'junit','html'],
    htmlReporter: {
      focusOnFailures: false,
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
    client:
    {
      runInParent :true,
    },
    
    singleRun: true,
    concurrency :Infinity,
    singleRun : false
  };
}