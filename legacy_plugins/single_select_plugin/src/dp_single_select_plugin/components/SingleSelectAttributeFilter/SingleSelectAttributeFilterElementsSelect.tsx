// (C) 2007-2023 GoodData Corporation
import React, { useMemo } from "react";
import { AttributeFilterElementsSelect, IAttributeFilterElementsSelectProps } from "@gooddata/sdk-ui-filters";
import { IAttributeElement } from "@gooddata/sdk-model";

import { ALL_ITEM } from "./constants.js";

/**
 * Prepends "All" item into the elements selection list.
 */
export const SingleSelectAttributeFilterElementsSelect: React.FC<IAttributeFilterElementsSelectProps> = (
    props,
) => {
    const { items, searchString } = props;

    const itemsWithAll = useMemo(
        () => (!searchString ? [ALL_ITEM as IAttributeElement].concat(items) : items),
        [items, searchString],
    );
    return <AttributeFilterElementsSelect {...props} items={itemsWithAll} />;
};
