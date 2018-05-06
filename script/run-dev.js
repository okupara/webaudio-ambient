
process.env.NODE_ENV='production';
process.chdir(__dirname);
process.chdir('../')

console.log(process.cwd());
const webpack = require('webpack');
const config = require(process.cwd() + '/webpack.config.js');

const compiler = webpack(config);
compiler.run((err, stats) => {
    if (err) {
        console.error(err);
    }
    console.log('ok');
});
