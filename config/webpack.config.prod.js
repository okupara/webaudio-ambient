const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.tsx'
  },
  output: {
      path:`${__dirname}/dist`,
      filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }/*,
      {
        test: /\.worker\.js/,
        exclude: [/node_modules/, /dist/],
        use: {
          loader: 'worker-loader',
          options: { inline: true }
        }
      }*/
      , {
        test: /\.css/,
        loader: ExtractTextPlugin.extract(
          Object.assign({
            fallback: {
              loader: require.resolve('style-loader'),
              options: {
                hmr: false
              }
            },
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  minimize: true,
                  sourceMap: false
                }
              }
            ]
          })
        )
      }/*,
      {
        test: /\.css$/
        loader: 'file-loader',
        options: {
          name:
        }
      }*/
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(process.cwd(), 'public', 'index.html')
    }),
    new ExtractTextPlugin({
      filename: 'index.css'
    })
  ],
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js', '.json'
    ]
  }
};
