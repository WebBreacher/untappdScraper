import React from 'react'
import PropTypes from 'prop-types'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import '../assets/styles/main.css'

const UntappdScraperWeb = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

UntappdScraperWeb.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object
}

export default UntappdScraperWeb
