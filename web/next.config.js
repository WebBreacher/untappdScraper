const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
const debug = process.env.NODE_ENV !== 'production'

const config = withCSS(withImages({
  webpack (config, options) {
    config.output.publicPath = !debug ?
      `/untappdScraper${config.output.publicPath}` : config.output.publicPath;
    config.assetPrefix = !debug ? '/untappdScraper/' : ''
    return config
  }
}))

module.exports = config