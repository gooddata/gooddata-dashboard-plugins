// (C) 2021-2022 GoodData Corporation
import {
    filterAttributeElements,
    filterObjRef,
    IAttributeFilter,
    IDashboardAttributeFilter,
    isNegativeAttributeFilter,
} from "@gooddata/sdk-model";

/**
 * Converts {@link IAttributeFilter} to {@link IDashboardAttributeFilter}.
 *
 * @param filter - filter to convert
 * @param localIdentifier - localIdentifier of the filter
 * @returns converted filter
 */
export function attributeFilterToDashboardAttributeFilter(
    filter: IAttributeFilter,
    localIdentifier: string | undefined,
): IDashboardAttributeFilter {
    const attributeElements = filterAttributeElements(filter);
    const displayForm = filterObjRef(filter);
    return {
        attributeFilter: {
            attributeElements,
            displayForm,
            negativeSelection: isNegativeAttributeFilter(filter),
            localIdentifier,
        },
    };
}
