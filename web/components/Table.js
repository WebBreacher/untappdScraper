import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import _startCase from 'lodash.startcase'
import PropTypes from 'prop-types'

/**
 * Abstraction module of AgGrid Table library, mainly for readonly purposes
 * @param {data, title, valueFormatter}
 */
const Table = ({ data, title, valueFormatter }) => {
  const columns = Object.keys(data[0]).map(key => (
    { headerName: _startCase(key), field: key, valueFormatter }
  ))

  return (
    <div className="Table">
      <header>
        <h3>{title}</h3>
      </header>

      <div
        className="ag-theme-balham"
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        <AgGridReact
          domLayout='autoHeight'
          columnDefs={columns}
          rowData={data}
          defaultColDef={
            {
              rowSelection: 'single',
              sortable: true,
              resizable: true,
              filter: true,
              flex: 1,
              minWidth: 100
            }
          }>

        </AgGridReact>
      </div>
    </div>
  )
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  valueFormatter: PropTypes.func
}

export default Table
