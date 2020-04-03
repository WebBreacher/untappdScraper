import React from 'react'
import {
    HorizontalGridLines,
    VerticalGridLines,
    XAxis,
    XYPlot,
    YAxis,
    VerticalBarSeries
  } from 'react-vis'
export default function Chart({data, headerTitle, yRange}){
    return (
        <div className="Chart">
            <header>
                <h3>{headerTitle}</h3>
            </header>
            <main>
            <XYPlot width={800} height={300} xType="ordinal" yType="linear" yDomain={yRange} >
            <VerticalBarSeries color="#fcc000" data={data} />
            <XAxis/>
            <YAxis title="Number of Drinks"/>
            </XYPlot>
            </main>
        </div>
    )
}