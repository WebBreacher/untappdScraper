import React from 'react'
import {
    HorizontalGridLines,
    VerticalGridLines,
    XAxis,
    XYPlot,
    YAxis,
    VerticalBarSeries
  } from 'react-vis'
export default function Chart({data, headerTitle}){
    return (
        <div className="Chart">
            <header>
                <h3>{headerTitle}</h3>
            </header>
            <main>
            <XYPlot width={800} height={300} xType="ordinal" yType="linear" yDomain={[0,10]} >
            <VerticalBarSeries color="#fcc000" data={data} />
            <XAxis/>
            <YAxis title="Number of beers"/>
            </XYPlot>
            </main>
        </div>
    )
}