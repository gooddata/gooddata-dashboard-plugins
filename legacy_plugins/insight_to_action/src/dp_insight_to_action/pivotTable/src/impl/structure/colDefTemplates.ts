// (C) 2007-2023 GoodData Corporation
import { ColDef, ValueFormatterParams } from "@ag-grid-community/all-modules";
import cx from "classnames";
import { invariant } from "ts-invariant";

import { TableFacade } from '../tableFacade.js';
import { ICorePivotTableProps } from '../../publicTypes.js';
import { AVAILABLE_TOTALS } from '../base/constants.js';
import { getMeasureCellFormattedValue, getMeasureCellStyle } from '../cell/cellUtils.js';
import { cellClassFactory } from '../cell/cellClass.js';
import { createCellRenderer } from '../cell/cellRenderer.js';

import { isSeriesCol } from './tableDescriptorTypes.js';
import { headerClassFactory } from './colDefHeaderClass.js';

export function rowAttributeTemplate(table: TableFacade, props: Readonly<ICorePivotTableProps>): ColDef {
    const cellRenderer = createCellRenderer();

    return {
        cellClass: cellClassFactory(table, props, "gd-row-attribute-column"),
        headerClass: headerClassFactory(table, props, "gd-row-attribute-column-header"),
        colSpan: (params) => {
            if (
                // params.data is undefined when rows are in loading state
                params.data &&
                params.data.colSpan &&
                AVAILABLE_TOTALS.find((item: string) => item === params.data[params.data.colSpan.headerKey])
            ) {
                return params.data.colSpan.count;
            }
            return 1;
        },
        valueFormatter: (params) => {
            return params.value === undefined ? null : params.value;
        },
        cellRenderer,
    };
}

export function columnAttributeTemplate(table: TableFacade, props: Readonly<ICorePivotTableProps>): ColDef {
    return {
        cellClass: cellClassFactory(table, props, "gd-column-attribute-column"),
        headerClass: headerClassFactory(table, props, "gd-column-attribute-column-header"),
    };
}

const AG_NUMERIC_CELL_CLASSNAME = "ag-numeric-cell";
const AG_NUMERIC_HEADER_CLASSNAME = "ag-numeric-header";

export function measureColumnTemplate(table: TableFacade, props: Readonly<ICorePivotTableProps>): ColDef {
    const cellRenderer = createCellRenderer();
    const separators = props.config?.separators;

    return {
        cellClass: cellClassFactory(table, props, cx(AG_NUMERIC_CELL_CLASSNAME, "gd-measure-column")),
        headerClass: headerClassFactory(
            table,
            props,
            cx(AG_NUMERIC_HEADER_CLASSNAME, "gd-measure-column-header"),
        ),
        // wrong params type from ag-grid, we need any
        valueFormatter: (params: ValueFormatterParams) => {
            const colDesc = table.tableDescriptor.getCol(params.colDef);

            invariant(isSeriesCol(colDesc));

            return params.value !== undefined
                ? getMeasureCellFormattedValue(
                      params.value,
                      colDesc.seriesDescriptor.measureFormat(),
                      separators,
                  )
                : (null as any);
        },
        cellStyle: (params) => {
            const colDesc = table.tableDescriptor.getCol(params.colDef);

            invariant(isSeriesCol(colDesc));

            return params.value !== undefined
                ? getMeasureCellStyle(
                      params.value,
                      colDesc.seriesDescriptor.measureFormat(),
                      separators,
                      true,
                  )
                : null;
        },
        cellRenderer,
    };
}

export function customColumnTemplate(table: TableFacade, props: Readonly<ICorePivotTableProps>): ColDef {
    const cellRenderer = "customColumnRenderer";
    const separators = props.config?.separators;

    return {
        cellClass: cellClassFactory(table, props, cx(AG_NUMERIC_CELL_CLASSNAME, "gd-measure-column")),
        headerClass: headerClassFactory(
            table,
            props,
            cx(AG_NUMERIC_HEADER_CLASSNAME, "gd-measure-column-header"),
        ),
        // wrong params type from ag-grid, we need any
        valueFormatter: (params: ValueFormatterParams) => {
            const colDesc = table.tableDescriptor.getCol(params.colDef);

            invariant(isSeriesCol(colDesc));

            return params.value !== undefined
                ? getMeasureCellFormattedValue(
                      params.value,
                      colDesc.seriesDescriptor.measureFormat(),
                      separators,
                  )
                : (null as any);
        },
        cellStyle: (params) => {
            const colDesc = table.tableDescriptor.getCol(params.colDef);

            invariant(isSeriesCol(colDesc));

            return params.value !== undefined
                ? getMeasureCellStyle(
                      params.value,
                      colDesc.seriesDescriptor.measureFormat(),
                      separators,
                      true,
                  )
                : null;
        },
        cellRenderer,
    };
}
