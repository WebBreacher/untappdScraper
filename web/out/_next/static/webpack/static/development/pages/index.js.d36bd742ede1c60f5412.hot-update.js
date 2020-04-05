webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/Table.js":
/*!*****************************!*\
  !*** ./components/Table.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ag_grid_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ag-grid-react */ "./node_modules/ag-grid-react/main.js");
/* harmony import */ var ag_grid_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ag_grid_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_startCase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash.startCase */ "./node_modules/lodash.startCase/index.js");
/* harmony import */ var lodash_startCase__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_startCase__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
var _this = undefined,
    _jsxFileName = "/Users/brandonevans/Repo/SANS/untappdScraper/web/components/Table.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;




/**
 * Abstraction module of AgGrid Table library, mainly for readonly purposes
 * @param {data, title, valueFormatter}
 */

var Table = function Table(_ref) {
  var data = _ref.data,
      title = _ref.title,
      valueFormatter = _ref.valueFormatter;
  var columns = Object.keys(data[0]).map(function (key) {
    return {
      headerName: lodash_startCase__WEBPACK_IMPORTED_MODULE_2___default()(key),
      field: key,
      valueFormatter: valueFormatter
    };
  });
  return __jsx("div", {
    className: "Table",
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16,
      columnNumber: 5
    }
  }, __jsx("header", {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17,
      columnNumber: 7
    }
  }, __jsx("h3", {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18,
      columnNumber: 9
    }
  }, title)), __jsx("div", {
    className: "ag-theme-balham",
    style: {
      height: '100%',
      width: '100%'
    },
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21,
      columnNumber: 7
    }
  }, __jsx(ag_grid_react__WEBPACK_IMPORTED_MODULE_1__["AgGridReact"], {
    domLayout: "autoHeight",
    columnDefs: columns,
    rowData: data,
    defaultColDef: {
      rowSelection: 'single',
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
      autoHeight: false
    },
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 9
    }
  })));
};

Table.propTypes = {
  data: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.array.isRequired,
  title: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  valueFormatter: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.func
};
/* harmony default export */ __webpack_exports__["default"] = (Table);

/***/ })

})
//# sourceMappingURL=index.js.d36bd742ede1c60f5412.hot-update.js.map