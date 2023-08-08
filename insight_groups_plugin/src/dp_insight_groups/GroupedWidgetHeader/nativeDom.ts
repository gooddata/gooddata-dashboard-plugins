// (C) 2023 GoodData Corporation

import React from "react";

import "./nativeDom.css";

const PARENT_CLASS = "gd-fluidlayout-column";

/***
 *
 * The current plugin API does not allow hiding of widgets and layout modifications in real time,
 * which would be needed for clean implementation.
 *
 * To be able to hide layout widgets, the low level browser API is used.
 *
 * This code found first element with "gd-fluidlayout-column" class and set css class based on
 * visible state.
 *
 */
export function setParentColumnVisibility(
    element: React.MutableRefObject<HTMLElement | null>,
    visible: boolean,
) {
    const column = findColumn(element.current);

    if (column && visible) {
        column.classList.remove("plugin-insight-groups-hidden");
        column.classList.add("plugin-insight-groups-visible");
    }
    if (column && !visible) {
        column.classList.add("plugin-insight-groups-hidden");
        column.classList.remove("plugin-insight-groups-visible");
    }
}

function findColumn(element: HTMLElement | null): HTMLElement | null {
    let currentTraversingEl = element;
    while (currentTraversingEl) {
        if (currentTraversingEl.classList.contains(PARENT_CLASS)) {
            return currentTraversingEl;
        }
        currentTraversingEl = currentTraversingEl.parentElement;
    }
    return null;
}
