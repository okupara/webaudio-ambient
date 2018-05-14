const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    app: "./src/index.tsx"
  },
  output: {
      path:`${__dirname}/dist`,
      filename: "[name].js"
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader?importLoaders=true']
          },
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: "ts-loader"
          }
        ]
      }
/*,
      {
        test: /\.worker\.js/,
        exclude: [/node_modules/, /dist/],
        use: {
          loader: 'worker-loader',
          options: { inline: true }
        }
      }*/
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(process.cwd(), 'public', 'index.html')
    })
  ],
  resolve: {
    extensions: [
      ".ts", ".tsx", ".js", ".json", ".css"
    ]
  }
};
