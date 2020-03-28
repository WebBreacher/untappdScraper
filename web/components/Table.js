import React from 'react'
import { AgGridReact } from 'ag-grid-react'

export const Table = (props) => {
    const minHeight = 26
    const columns = Object.keys(props.data[0]).map(key => ({headerName: key, field: key, rowHeight: '30px'})) 
    const rowLength = props.data.length
    return (
    <div className="Table">
        <header>
            <h3>{props.title}</h3>
        </header>
        <div
        className="ag-theme-balham"
        style={{
            height: '100%',
            width: '100%'}}
      >
        <AgGridReact
        domLayout='autoHeight'
          columnDefs={columns}
          rowData={props.data}
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