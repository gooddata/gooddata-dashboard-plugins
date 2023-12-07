// (C) 2007-2023 GoodData Corporation
import { ICorePivotTableProps } from '../publicTypes.js';

import {
    ICustomGridOptions,
    TableAgGridCallbacks,
    TableConfigAccessors,
    TableMenuCallbacks,
} from './privateTypes.js';
import { ICommonHeaderParams } from './structure/headers/HeaderCell.js';
import { cellClassFactory } from './cell/cellClass.js';
import ColumnHeader from './structure/headers/ColumnHeader.js';
import { MIN_WIDTH } from './resizing/columnSizing.js';
import { headerClassFactory } from './structure/colDefHeaderClass.js';
import ColumnGroupHeader from './structure/headers/ColumnGroupHeader.js';
import { onCellClickedFactory } from './cell/onCellClick.js';
import {
    COLUMN_ATTRIBUTE_COLUMN,
    CUSTOM_COLUMN,
    DEFAULT_AUTOSIZE_PADDING,
    DEFAULT_ROW_HEIGHT,
    MEASURE_COLUMN,
    ROW_ATTRIBUTE_COLUMN,
} from './base/constants.js';
import {
    columnAttributeTemplate,
    customColumnTemplate,
    measureColumnTemplate,
    rowAttributeTemplate,
} from './structure/colDefTemplates.js';
import { TableFacade } from './tableFacade.js';
import { createLoadingRenderer } from './data/loadingRenderer.js';

export function createGridOptions(
    table: TableFacade,
    tableMethods: TableAgGridCallbacks & TableConfigAccessors & TableMenuCallbacks,
    props: Readonly<ICorePivotTableProps>,
): ICustomGridOptions {
    const { colDefs } = table.tableDescriptor;
    const { pageSize } = props;
    const totalRowCount = table.getRowCount();
    // const customColumn = {
    //     colId: "c_3",
    //     field: "c_3",
    //     headerName: "BUTTON",
    //     maxWidth: 2000,
    //     suppressSizeToFit: false,
    //     type: "MEASURE_COLUMN",
    //     width: 200
    // };

    const allColumnDefs = colDefs.sliceColDefs.concat(colDefs.rootDataColDefs);
    // .concat(customColumn);

    /*
     * This is a half-workaround around the visual weirdness where upon load/sort ag-grid renders full
     * page of empty rows and then possibly shrinks back to the actual size of data obtained from backend.
     *
     * since the code knows total count of all data on all pages already, it is possible to set the effective
     * page size to minimum of the requested page size and the total of all data => thus eliminating this
     * effect.
     *
     * the only dumb thing about this approach is that dynamically added subtotals (via menu) kick this
     * slightly out of balance as extra rows get added and ag-grid needs to load additional pages... and so an
     * extra buffer of couple of rows in case it is possible add subtotals. while there will be some expanding
     * and shrinking, it will not be so big.
     */
    const extraTotalsBuffer = props.config && props.config.menu ? 10 : 0;
    const effectivePageSize = Math.min(pageSize!, totalRowCount + extraTotalsBuffer);

    const commonHeaderComponentParams: ICommonHeaderParams = {
        onMenuAggregationClick: tableMethods.onMenuAggregationClick,
        getTableDescriptor: () => table.tableDescriptor,
        getExecutionDefinition: tableMethods.getExecutionDefinition,
        getColumnTotals: tableMethods.getColumnTotals,
        intl: props.intl,
    };

    return {
        // Initial data
        columnDefs: allColumnDefs,
        rowData: [],
        defaultColDef: {
            cellClass: cellClassFactory(table, props),
            headerComponentFramework: ColumnHeader as any,
            headerComponentParams: {
                menu: tableMethods.getMenuConfig,
                enableSorting: true,
                ...commonHeaderComponentParams,
            },
            minWidth: MIN_WIDTH,
            sortable: true,
            resizable: true,
        },
        defaultColGroupDef: {
            headerClass: headerClassFactory(table, props),
            children: [],
            headerGroupComponentFramework: ColumnGroupHeader as any,
            headerGroupComponentParams: {
                menu: tableMethods.getMenuConfig,
                ...commonHeaderComponentParams,
            },
        },
        onCellClicked: onCellClickedFactory(table, props),
        onSortChanged: tableMethods.onSortChanged,
        onColumnResized: tableMethods.onGridColumnResized,
        onGridColumnsChanged: tableMethods.onGridColumnsChanged,
        onModelUpdated: tableMethods.onModelUpdated,
        onPinnedRowDataChanged: tableMethods.onPinnedRowDataChanged,

        // Basic options
        suppressMovableColumns: true,
        suppressCellSelection: true,
        suppressAutoSize: tableMethods.hasColumnWidths,
        enableFilter: false,

        // infinite scrolling model
        rowModelType: "infinite",
        paginationPageSize: effectivePageSize,
        cacheOverflowSize: effectivePageSize,
        cacheBlockSize: effectivePageSize,
        maxConcurrentDatasourceRequests: 1,
        infiniteInitialRowCount: effectivePageSize,
        maxBlocksInCache: 10,
        onGridReady: tableMethods.onGridReady,
        onFirstDataRendered: tableMethods.onFirstDataRendered,
        onBodyScroll: tableMethods.onBodyScroll,
        onGridSizeChanged: tableMethods.onGridSizeChanged,

        // Column types
        columnTypes: {
            [ROW_ATTRIBUTE_COLUMN]: rowAttributeTemplate(table, props),
            [COLUMN_ATTRIBUTE_COLUMN]: columnAttributeTemplate(table, props),
            [MEASURE_COLUMN]: measureColumnTemplate(table, props),
            [CUSTOM_COLUMN]: customColumnTemplate(table, props),
        },

        // Custom renderers
        frameworkComponents: {
            // any is needed here because of incompatible types with AgGridReact types
            loadingRenderer: createLoadingRenderer(table, props), // loading indicator
            customColumnRenderer: props.customColumnRenderer,
        },

        // Custom CSS classes
        rowClass: "gd-table-row",
        rowHeight: DEFAULT_ROW_HEIGHT,
        autoSizePadding: DEFAULT_AUTOSIZE_PADDING,
        enableBrowserTooltips: true,
    };
}
