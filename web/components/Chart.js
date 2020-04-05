import React from 'react'
import PropTypes from 'prop-types'

import {
  XAxis,
  YAxis,
  VerticalBarSeries,
  FlexibleWidthXYPlot
} from 'react-vis'

export default function Chart ({ data, headerTitle, yRange }) {
  return (
    <div className="Chart">
      <header>
        <h3>{headerTitle}</h3>
      </header>

      <main>
        <FlexibleWidthXYPlot height={300} xType="ordinal" yType="linear" yDomain={yRange} >
          <VerticalBarSeries color="#fcc000" data={data} />
          <XAxis/>
          <YAxis title="Number of Drinks"/>
        </FlexibleWidthXYPlot>
      </main>
    </div>
  )
}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  headerTitle: PropTypes.string,
  yRange: PropTypes.func
}
