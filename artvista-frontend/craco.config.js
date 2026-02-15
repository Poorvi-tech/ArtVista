module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress webpack deprecation warnings
      webpackConfig.ignoreWarnings = [
        {
          module: /webpack-dev-server/,
          message: /DeprecationWarning/
        }
      ];
      
      return webpackConfig;
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Return middlewares to fix deprecation warnings
      return middlewares;
    }
  }
};