// (C) 2007-2023 GoodData Corporation
import React from "react";
import { ICellRendererParams } from "@ag-grid-community/all-modules";
import escape from "lodash/escape.js";

import { isSomeTotal } from "../data/dataSourceUtils.js";
import { VALUE_CLASS } from "../base/constants.js";
import { IGridTotalsRow } from "../data/resultTypes.js";
import { agColId } from "../structure/tableDescriptorTypes.js";

function hasTotalForCurrentColumn(params: ICellRendererParams): boolean {
    const row = params.data as IGridTotalsRow;

    if (!row || !row.calculatedForColumns) {
        return false;
    }

    const colId = agColId(params.colDef);

    return row.calculatedForColumns.some((col) => col === colId);
}

/**
 * Returns common implementation of cell renderer used for normal cells, sticky header cells and totals.
 *
 * TODO: Consider to use custom pinnerRowCellRenderer in order to reduce number of conditionals
 */
export function createCellRenderer(): (params: ICellRendererParams, returnComponent?: boolean) => string {
    return (params: ICellRendererParams, returnComponent): string | any => {
        const isRowTotalOrSubtotal = isSomeTotal(params.data?.type);
        const isActiveRowTotal = isRowTotalOrSubtotal && hasTotalForCurrentColumn(params);
        const formattedValue =
            isRowTotalOrSubtotal && !isActiveRowTotal && !params.value
                ? "" // inactive row total cells should be really empty (no "-") when they have no value (RAIL-1525)
                : escape(params.formatValue(params.value));
        const className = params.node.rowPinned === "top" ? "gd-sticky-header-value" : VALUE_CLASS;

        if (returnComponent) return <span className={className}>{formattedValue || ""}</span>;
        return `<span class="${className}">${formattedValue || ""}</span>`;
    };
}
