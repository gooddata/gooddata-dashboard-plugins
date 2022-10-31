// (C) 2021-2022 GoodData Corporation
import React from "react";
import { AttributeFilterButton, IAttributeFilterButtonProps } from "@gooddata/sdk-ui-filters";
import { SingleSelectAttributeFilterElementsSelectItem } from "./SingleSelectAttributeFilterElementsSelectItem";
import { SingleSelectAttributeFilterElementsSelect } from "./SingleSelectAttributeFilterElementsSelect";
import { SingleSelectAttributeFilterElementsSelectActions } from "./SingleSelectAttributeFilterElementsSelectActions";

/**
 * Modifies the default attribute filter component with a single-select behavior.
 */
export function SingleSelectAttributeFilter(props: IAttributeFilterButtonProps): JSX.Element {
    return (
        <AttributeFilterButton
            {...props}
            ElementsSelectComponent={SingleSelectAttributeFilterElementsSelect}
            ElementsSelectActionsComponent={SingleSelectAttributeFilterElementsSelectActions}
            ElementsSelectItemComponent={SingleSelectAttributeFilterElementsSelectItem}
        />
    );
}
