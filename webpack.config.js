module.exports = {
    mode: 'development',
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
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader"
        }/*,
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
    resolve: {
      extensions: [
        ".ts", ".tsx", ".js", ".json"
      ]
    }
};
