const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');

const baseConfig = require('./webpack.base.config.js');

const config = merge(baseConfig, {
  mode: 'production',

  devtool: 'cheap-source-map',

  entry: {
    // the entry point of our app
    app: __dirname + '/src/index.tsx',
  },

  output: {
    filename: "[name].bundle-[hash:8].js",
    chunkFilename: '[id].chunk-[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        terserOptions: {
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
    }
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]--[local]--[hash:base64:5]"
              },
              importLoaders: 2
            }
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: ['./src/assets/styles/global-variables.scss']
            }
          }
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
      modules: true
    }),

    new webpack.EnvironmentPlugin({
      NETWORKS: "main",
      NODE_ENV: "production",
      SHOW_ALL_DAOS: "false",
      BASE_URL: "https://alchemy.daostack.io",
      DISQUS_SITE: 'daostack-alchemy',
      ARC_GRAPHQLHTTPPROVIDER: "",
      ARC_GRAPHQLWSPROVIDER : "",
      ARC_WEB3PROVIDER : "",
      ARC_WEB3PROVIDERREAD : "",
      ARC_IPFSPROVIDER: "",
      ARC_IPFSPROVIDER_HOST : "",
      ARC_IPFSPROVIDER_PORT : "",
      ARC_IPFSPROVIDER_PROTOCOL : "",
      ARC_IPFSPROVIDER_API_PATH : "",
      INFURA_ID : "",
      ETHERSCAN_API_KEY : "",
      MIXPANEL_TOKEN: "",
    }),

    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' }
    ]),
  ],
});

if (process.env.ANALYZE) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  config.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
  }));
}

module.exports = config;
