const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
const debug = process.env.NODE_ENV !== 'production'

const config = withCSS(withImages({
  inlineImageLimit: 65536,
  webpack (config, options) {
    config.output.publicPath = !debug ?
      `/untappdScraper${config.output.publicPath}` : config.output.publicPath
    return config
  }
}))

config.assetPrefix = !debug ? '/untappdScraper/' : ''

module.exports = config