const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let initProject = {
  openPage: 'index',
  pages: ['index']
};

let cleanFolderInit = {
  target: [
    'build',
    'dist'
  ],
  options: {
    root: path.resolve('./'),
    verbose: true
    // exclude: ['*.html']
  }
}

let baseConfig = {
  mode: 'development',
  //載入檔案入口
  entry: {
    ['index']: path.resolve(__dirname, './resources/js/index.js'),
  },
  //打包輸出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        //Eslint-Loader
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
        options: {
          emitError: true
        }
      },
      {
        //Babel-Loader
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.pug$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'pug-loader',
          options: {
            self: true,
            pretty: true,
           },
        }]
      },
      {
        // Sass-loader + css-loader
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { 
            loader: 'css-loader',
            options: { 
              url: false 
            } 
          },
          'sass-loader'
        ]
      }
    ]
  },
  //額外外掛功能
  plugins: [
    new CleanWebpackPlugin(
      cleanFolderInit.target,
      cleanFolderInit.options
    ),
    new CopyWebpackPlugin([
      {
        from: './resources/images/',
        to: './images/',
        force: true
      }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css'
    }),
  ],
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    writeToDisk: true,
    open: true,
    openPage: `./index.html`,
    compress: true,
    watchContentBase: true,
    //偵測檔案異動更目錄位置
    contentBase: path.join(__dirname, './resources/'),
    port: 3000
  }
}

//Multiple Pages Build.
initProject.pages.map(function(proName) {
  baseConfig.plugins.push(
    new HtmlWebpackPlugin({
      chunks: [`${proName}`],
      filename: `./index.html`,
      template: path.resolve(__dirname, `./resources/${proName}.pug`),
      data: require(`./resources/${proName}.json`),
      inject: true
    })
  );
});

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    baseConfig.optimization = {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    }
  }

  return baseConfig;
}