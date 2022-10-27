// (C) 2007-2022 GoodData Corporation
import React, { useMemo } from "react";
import { AttributeFilterElementsSelect, IAttributeFilterElementsSelectProps } from "@gooddata/sdk-ui-filters";
import { ALL_ITEM } from "./constants";

/**
 * Prepends "All" item into the elements selection list.
 */
export const SingleSelectAttributeFilterElementsSelect: React.VFC<IAttributeFilterElementsSelectProps> = (
    props,
) => {
    const { items, searchString } = props;

    const itemsWithAll = useMemo(
        () => (!searchString ? [ALL_ITEM].concat(items) : items),
        [items, searchString],
    );
    return <AttributeFilterElementsSelect {...props} items={itemsWithAll} />;
};
