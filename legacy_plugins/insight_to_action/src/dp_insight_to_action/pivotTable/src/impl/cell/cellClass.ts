// (C) 2007-2021 GoodData Corporation
import { CellClassParams } from "@ag-grid-community/all-modules";
import isEmpty from "lodash/isEmpty.js";
import cx from "classnames";
import { invariant } from "ts-invariant";
import { convertDrillableItemsToPredicates } from "@gooddata/sdk-ui";
import last from "lodash/last.js";

import { TableFacade } from "../tableFacade.js";
import { ICorePivotTableProps } from "../../publicTypes.js";
import { IGridRow } from "../data/resultTypes.js";
import { isSeriesCol, isRootCol } from "../structure/tableDescriptorTypes.js";
import { ROW_SUBTOTAL, ROW_TOTAL, MEASURE_COLUMN } from "../base/constants.js";
import { isCellDrillable } from "../drilling/cellDrillabilityPredicate.js";

import { getCellClassNames } from "./cellUtils.js";

export type CellClassProvider = (cellClassParams: CellClassParams) => string;

export function cellClassFactory(
    table: TableFacade,
    props: Readonly<ICorePivotTableProps>,
    classList?: string,
): CellClassProvider {
    return (cellClassParams: CellClassParams): string => {
        const { rowIndex, data } = cellClassParams;
        const row: IGridRow = data;
        const isEmptyCell = !cellClassParams.value;
        // hide empty sticky cells
        const isTopPinned = cellClassParams.node.rowPinned === "top";

        if (isEmpty(row)) {
            // ag-grid calls getCellClass before the data is available & rows are created - there will be no
            // data in the cellClassParams. not sure what is the purpose or whether that is a bug. anyway it
            // does not make sense to proceed further.
            //
            // ag-grid may call this with either data undefined or data being empty object

            // empty row data are also possible for pinned row, when no cell should be visible
            return cx(classList, isTopPinned && isEmptyCell ? "gd-hidden-sticky-column" : null);
        }

        const dv = table.getDrillDataContext();
        const colDef = cellClassParams.colDef;
        const col = table.tableDescriptor.getCol(colDef);

        invariant(!isRootCol(col));

        const drillablePredicates = convertDrillableItemsToPredicates(props.drillableItems!);
        const isRowTotal = row.type === ROW_TOTAL;
        const isRowSubtotal = row.type === ROW_SUBTOTAL;
        let hasDrillableHeader = false;

        const cellAllowsDrill = !isEmptyCell || colDef.type === MEASURE_COLUMN;
        if (!isRowTotal && !isRowSubtotal && cellAllowsDrill) {
            hasDrillableHeader = isCellDrillable(col, row, dv, drillablePredicates);
        }

        const colIndex = table.tableDescriptor.getAbsoluteLeafColIndex(col);
        const measureIndex = isSeriesCol(col) ? last(col.fullIndexPathToHere) : undefined;
        const isPinnedRow = cellClassParams.node.isRowPinned();
        const hiddenCell = !isPinnedRow && table.getGroupingProvider().isRepeatedValue(col.id, rowIndex);
        const rowSeparator = !hiddenCell && table.getGroupingProvider().isGroupBoundary(rowIndex);
        const subtotalStyle = row?.subtotalStyle;

        return cx(
            classList,
            measureIndex !== undefined ? `gd-column-measure-${measureIndex}` : null,
            getCellClassNames(rowIndex, colIndex, hasDrillableHeader),
            `gd-column-index-${colIndex}`,
            isRowTotal ? "gd-row-total" : null,
            subtotalStyle ? `gd-table-row-subtotal gd-table-row-subtotal-${subtotalStyle}` : null,
            hiddenCell ? "gd-cell-hide s-gd-cell-hide" : null,
            rowSeparator ? "gd-table-row-separator s-gd-table-row-separator" : null,
            isTopPinned && isEmptyCell ? "gd-hidden-sticky-column" : null,
        );
    };
}
