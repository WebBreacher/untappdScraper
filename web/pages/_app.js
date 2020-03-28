import React from 'react'
import PropTypes from 'prop-types'
import '../assets/styles/main.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const UntappdScraperWeb = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

UntappdScraperWeb.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object
}

export default UntappdScraperWeb
