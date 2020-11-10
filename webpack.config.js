const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const IfPlugin = require('if-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const src = {
  root: path.resolve(__dirname, 'src'),
  output: path.resolve(__dirname, 'dist'),
  stylesEntryPoint: path.resolve(__dirname, 'src/styles.scss'),
  node_modules: path.resolve(__dirname, 'node_modules'),
  widgetConfig: path.resolve(__dirname, 'widget.config.json'),
  assets: 'assets',
};

const config = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    context: src.root,
    entry: './',
    output: {
      path: src.output,
      filename: isProd ? 'script.js' : 'widget.js',
      publicPath: isProd ? '' : 'https://localhost:1337/',
    },
    async externals(context, request, callback) {
      try {
        const file = await fsp.readFile(src.widgetConfig);
        const external = JSON.parse(file);
        const modules = [
          ...Object.keys(external.modules),
          ...Object.keys(external.submodules),
          ...external.builtins,
        ];

        if (modules.includes(request)) {
          callback(null, `window.require('${request}')`);
          return;
        }

        callback();
      } catch (e) {
        callback(e);
      }
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
    },
    optimization: {
      //minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
            }
          }
        })
      ],
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'widget.css',
      }),
      new OptimizeCSSAssetsPlugin({}),
      new IfPlugin(isProd, new webpack.HotModuleReplacementPlugin()),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: src.root,
          loader: 'babel-loader',
        }, 
        {
          test: /\.vue$/,
          include: src.root,
          loader: 'vue-loader',
        },
        {
          test: /\.(twig|html)$/,
          include: src.root,
          loader: 'raw-loader'
        },
        {
          test: /\.scss$/,
          use: [
              'style-loader',
              MiniCssExtractPlugin.loader,
              {
                  loader: "css-loader",
                  options: {sourceMap: true}
              }, {
                  loader: "postcss-loader",
                  options: {sourceMap: true, config: {path: `./postcss.config.js`} }
              }, {
                  loader: "sass-loader",
                  options: {sourceMap: true}
              }
          ]
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: `${src.assets}/[hash].[ext]`,
          },
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: `${src.assets}/[hash].[ext]`,
          },
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: `${src.assets}/[hash].[ext]`,
          },
        },
        {
          test: /\.svg$/,
          issuer: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-svg-loader',
              options: {
                jsx: true,
              },
            },
          ],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.(css|styl)$/,
          loader: 'file-loader',
          options: {
            name: `${src.assets}/[hash].[ext]`,
          },
        },
        {
          test: /\.(png|jpe?g)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `${src.assets}/[hash].[ext]`,
              },
            },
            {
              loader: 'img-loader',
              options: {
                enabled: argv.mode === 'production',
              },
            },
          ],
        },
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 1337,
      hot: true,
      inline: true,
      https: {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem'),
      },
      allowedHosts: ['.amocrm.ru'],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
    },
  };
};

module.exports = config;
