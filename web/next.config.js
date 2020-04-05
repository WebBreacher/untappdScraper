const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
const debug = process.env.NODE_ENV !== 'production';

const config = withCSS(withImages({
  webpack (config, options) {
    return config
  }
}))

config.assetPrefix = !debug ? '/untappdScraper/' : '',

module.exports = config
