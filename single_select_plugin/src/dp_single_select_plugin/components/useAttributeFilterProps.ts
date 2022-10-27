// (C) 2021-2022 GoodData Corporation
import { useCallback, useMemo } from "react";
import {
    IDashboardAttributeFilterProps,
    dashboardAttributeFilterToAttributeFilter,
    useParentFilters,
    useDashboardSelector,
    selectLocale,
} from "@gooddata/sdk-ui-dashboard";
import { IAttributeFilterButtonProps } from "@gooddata/sdk-ui-filters";
import { attributeFilterToDashboardAttributeFilter } from "./utils";
import { IAttributeFilter } from "@gooddata/sdk-model";

/**
 * Maps dashboard attribute filter props to the AttributeFilter component props.
 *
 * @param props - dashboard attribute filter props 
 * @returns attribute filter props
 */
export function useAttributeFilterProps(props: IDashboardAttributeFilterProps): IAttributeFilterButtonProps {
    const { filter, onFilterChanged } = props;

    const { parentFilters, parentFilterOverAttribute } = useParentFilters(filter);
    const locale = useDashboardSelector(selectLocale);

    const attributeFilter = useMemo(() => {
        return dashboardAttributeFilterToAttributeFilter(filter);
    }, [filter]);

    const onApply = useCallback(
        (newFilter: IAttributeFilter) => {
            onFilterChanged(
                attributeFilterToDashboardAttributeFilter(newFilter, filter.attributeFilter.localIdentifier),
            );
        },
        [filter.attributeFilter.localIdentifier],
    );

    return {
        filter: attributeFilter,
        onApply,
        parentFilters,
        parentFilterOverAttribute,
        locale,
        fullscreenOnMobile: true,
    };
}
