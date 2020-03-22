import React from 'react'
import PropTypes from 'prop-types'
import '../styles.css'

const UntappdScraperWeb = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

UntappdScraperWeb.propTypes = {
  Component: React.Component,
  pageProps: PropTypes.object
}

export default UntappdScraperWeb
