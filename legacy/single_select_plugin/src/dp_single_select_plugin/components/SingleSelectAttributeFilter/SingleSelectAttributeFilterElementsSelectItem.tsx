// (C) 2007-2023 GoodData Corporation
import React, { useCallback } from "react";
import cx from "classnames";
import { IAttributeFilterElementsSelectItemProps, useAttributeFilterContext } from "@gooddata/sdk-ui-filters";
import { IAttributeElement } from "@gooddata/sdk-model";
import { ALL_ITEM } from "./constants";

function getElementTitle(element: IAttributeElement) {
    return element.title || "(empty value)";
}

function isElementSelected(
    workingSelectionElements: IAttributeElement[],
    isWorkingSelectionInverted: boolean,
    element: IAttributeElement,
) {
    if (workingSelectionElements.length === 0 && isWorkingSelectionInverted) {
        // For empty selection with negative filter, ALL_ITEM should selected.
        return element === ALL_ITEM;
    } else if (isWorkingSelectionInverted) {
        // For negative selection, only items that are not selected should be displayed as selected.
        return element !== ALL_ITEM && workingSelectionElements.every((el) => el !== element);
    } else {
        // For positive selection, only items that are selected should be displayed as selected.
        return workingSelectionElements.some((el) => el === element);
    }
}

/**
 * Renders elements selection list item as a single select list item.
 */
export const SingleSelectAttributeFilterElementsSelectItem: React.VFC<
    IAttributeFilterElementsSelectItemProps
> = (props) => {
    const { item, onSelectOnly } = props;
    const { workingSelectionElements, onSelect, isWorkingSelectionInverted } = useAttributeFilterContext();

    // Modify item click behavior to select only this particular item.
    const onItemClick = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            if (item === ALL_ITEM) {
                // All item clicked -> set empty negative filter.
                onSelect([], true);
            } else {
                // Common element clicked -> set positive filter for this particular element.
                onSelect([item], false);
            }
        },
        [onSelectOnly],
    );

    const isSelected = isElementSelected(workingSelectionElements, isWorkingSelectionInverted, item);
    const itemTitle = getElementTitle(item);

    return (
        <div
            className={cx("gd-attribute-filter-elements-select-item__next", "gd-list-item", {
                "is-selected": isSelected,
            })}
            onClick={onItemClick}
            title={itemTitle}
        >
            {itemTitle ?? "(empty value)"}
        </div>
    );
};
