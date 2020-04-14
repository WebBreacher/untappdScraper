const withImages = require('next-images')
const withCSS = require('@zeit/next-css')

const config = withCSS(withImages({
  webpack (config, options) {
    return config
  }
}))

module.exports = config
