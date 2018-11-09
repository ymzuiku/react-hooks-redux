const resolve = require('path').resolve;
const fs = require('fs-extra');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FastUglifyJsPlugin = require('fast-uglifyjs-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const isDev = process.env.prod !== '1';

class Tip {
  constructor(paths, port=3300) {
    const rootPath = process.cwd();
    this.paths = {
      root: rootPath,
      output: resolve(rootPath, 'lib'),
      public: resolve(rootPath, 'public'),
      package: resolve(rootPath, 'package.json'),
      entry: resolve(rootPath, 'src/index.js'),
      src: resolve(rootPath, 'src'),
      dll: resolve(rootPath, 'public/dll'),
      template: resolve(rootPath, 'public/index.html'),
      paths,
    };
    this.isDev = isDev;
    if (!isDev) {
      fs.mkdirpSync(this.paths.output);
    }
    this.tsconfig = {
      compilerOptions: {
        target: 'es3',
        module: 'esnext',
        noImplicitAny: true,
        removeComments: true,
        preserveConstEnums: true,
        jsx: 'react',
        sourceMap: true,
      },
      include: ['./src/**/*'],
      exclude: ['node_modules', '**/*.spec.ts'],
    };
    this.stats = {
      errorsOnly: 'errors-only',
    };
    this.target = {
      web: 'web',
      node: 'node',
    };
    this.mode = {
      none: 'none',
      development: 'development',
      production: 'production',
    };
    this.devtool = {
      none: undefined,
      eval: 'eval',
      sourceMap: 'source-map',
      inlineSourceMap: 'inline-source-map',
      cheapModuleEvalSourceMap: 'cheap-module-eval-source-map',
    };
    this.devServer = {
      contentBase: this.paths.public,
      watchContentBase: true,
      port: port,
      host: '0.0.0.0',
      useLocalIp: true,
      // hot: true, //开启有可能不显示内容
      open: false,
      progress: false,
      openPage: '/',
      allowedHosts: [],
      headers: {},
      disableHostCheck: false,
      compress: true,
      clientLogLevel: 'info',
      https: false,
      lazy: false,
      before: function(app) {},
      after: function(app) {},
      quiet: false, //屏蔽所有错误,控制台中输出打包的信息
      inline: true, //开启页面自动刷新
      stats: 'errors-only',
      noInfo: false,
      proxy: {
        // '/api-proxy': 'http://localhost:7000',
      },
    };
    this.resolve = {
      extensions: [
        '.web.tsx',
        '.tsx',
        '.web.ts',
        '.ts',
        '.web.js',
        '.mjs',
        '.js',
        '.json',
        '.web.jsx',
        '.jsx',
      ],
      alias: {
        'react-native': 'react-native-web',
      },
    };
    this.module = {
      rules: {
        eslint: {
          test: process.env.nolint ? /\.(nolint)$/ : /\.(js|jsx|mjs)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                // formatter: eslintFormatter,
                eslintPath: require.resolve('eslint'),
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          include: this.paths.src,
        },
        tsLodaer: {
          test: /\.(tsx|ts)?$/,
          loader: 'ts-loader',
          // options: {
          //   transpileOnly: true,
          // },
        },
        // .babelrc
        babelLoaderBuild: {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          // include: [
          //   /node_modules\/react-navigation/,
          // ],
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              comments: isDev ? false : true,
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                'styled-components',
                '@babel/plugin-syntax-dynamic-import',
                ['transform-class-properties', { spec: true }],
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: false,
                  },
                ],
                [
                  'module-resolver',
                  {
                    alias: {
                      '^react-native$': 'react-native-web',
                    },
                  },
                ],
              ],
            },
          },
        },
        babelLoaderDll: {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          include: [
            /node_modules\/react-native-/,
            /node_modules\/react-native-web/,
          ],
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              comments: true,
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['transform-class-properties', { spec: true }],
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: false,
                  },
                ],
                [
                  'module-resolver',
                  {
                    alias: {
                      '^react-native$': 'react-native-web',
                    },
                  },
                ],
              ],
            },
          },
        },
        sourceMapLoader: {
          enforce: 'pre',
          test: /\.(js|jsx)$/,
          loader: 'source-map-loader',
        },
        urlLoader: {
          test: /\.(png|svg|jpg|gif|pdf)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        fileLoader: {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
        cssLoader: {
          test: /\.css$/,
          use: [
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        },
        stylusLoader: {
          test: /\.styl$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'stylus-loader',
              options: {
                strictMath: true,
                noIeCompat: true,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        },
        lessLoader: {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'less-loader',
              options: {
                strictMath: true,
                noIeCompat: true,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        },
      },
    };
    this.plugins = {
      HashedModuleIdsPlugin: new webpack.HashedModuleIdsPlugin(),
      ProvidePlugin: new webpack.ProvidePlugin({
        $: 'jquery',
        _: 'lodash',
      }),
      HtmlWebpackPlugin: new HtmlWebpackPlugin({
        template: this.paths.template,
        minify: true,
        // minify: {
        //   removeAttributeQuotes: false, // 移除属性的引号
        // },
      }),
      null: new webpack.DefinePlugin({
        __DEV__: false,
      }),
      DefinePlugin: new webpack.DefinePlugin({
        __DEV__: false,
      }),
      HotModuleReplacementPlugin: new webpack.HotModuleReplacementPlugin(),
      FastUglifyJsPluginProd: new FastUglifyJsPlugin({
        compress: {
          warnings: false,
        },
        debug: false,
        cache: false,
        sourceMap: false,
      }),
      FastUglifyJsPluginDev: new FastUglifyJsPlugin({
        compress: false,
        debug: true,
        cache: true,
        sourceMap: true,
        cacheFolder: resolve(this.paths.root, './node_modules/.cache'),
      }),
      FastUglifyJsPluginDll: new FastUglifyJsPlugin({
        compress: {
          warnings: false,
        },
        debug: true,
        cache: false,
        sourceMap: true,
        cacheFolder: resolve(this.paths.root, './node_modules/.cache'),
      }),
      CleanWebpackPlugin: new CleanWebpackPlugin(['*'], {
        root: this.paths.output,
        exclude: ['video'],
        verbose: true,
        dry: false,
      }),
      DllReferencePlugin: new webpack.DllReferencePlugin({
        manifest: resolve(this.paths.dll, 'dll-manifest.json'),
      }),
      DllPlugin: new webpack.DllPlugin({
        path: resolve(this.paths.dll, 'dll-manifest.json'),
        name: 'dll_library',
      }),
      CopyWebpackPlugin: new CopyWebpackPlugin([
        {
          from: this.paths.public,
          to: this.paths.output,
        },
      ]),
    };
  }
}

module.exports = function(...args) {
  return new Tip(...args);
};
