const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
const debug = process.env.NODE_ENV !== 'production';

const assetPrefix = !debug ? '/untappdScraper' : ''

const config = withCSS(withImages({
  assetPrefix,
  webpack (config, options) {
    return config
  }
}))

config.assetPrefix = assetPrefix

module.exports = config
