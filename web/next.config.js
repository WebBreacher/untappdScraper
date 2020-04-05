// next.config.js
const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
module.exports = withCSS(withImages({
  webpack (config, options) {
    return config
  }
}))
