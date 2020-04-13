const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'presets': [
    'next/babel'
  ],
  plugins: [
    ['transform-define', {
      'process.env.BACKEND_URL': prod ? '/untappdScraper' : ''
    }]
  ]
};
