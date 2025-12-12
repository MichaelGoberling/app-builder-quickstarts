const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: [
    {'@adobe/aio-sdk': 'commonjs @adobe/aio-sdk'},
    /^@restatedev\//  // Externalize all @restatedev packages
  ],
  optimization: {
    minimize: false
  }
};


