import React from 'react'
import { AgGridReact } from 'ag-grid-react'

export const Table = (props) => {
    const columns = Object.keys(props.data[0]).map(key => ({headerName: key, field: key})) 
    return (
    <div className="Table">
        <header>
            <h3>{props.title}</h3>
        </header>
        <div
        className="ag-theme-balham"
        style={{
        height: '800px',
        width: 'auto',
        overflow: 'auto'}}
      >
        <AgGridReact
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