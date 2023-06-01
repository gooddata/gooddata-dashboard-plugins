// (C) 2021-2022 GoodData Corporation
import React from "react";
import { IDashboardAttributeFilterProps } from "@gooddata/sdk-ui-dashboard";
import { AttributeFilterButton } from "@gooddata/sdk-ui-filters";
import { useIsSingleSelect } from "./useIsSingleSelect";
import { SingleSelectAttributeFilter } from "./SingleSelectAttributeFilter/SingleSelectAttributeFilter";
import { useAttributeFilterProps } from "./useAttributeFilterProps";

export function PluginAttributeFilter(props: IDashboardAttributeFilterProps): JSX.Element {
    const attributeFilterProps = useAttributeFilterProps(props);
    // Instead of doing this check inside the attribute filter provider,
    // we are doing it inside the component, so we can do the comparison by identifier, instead of the ObjRef.
    // (eg., on GoodData Platform backend, filter display forms are stored as uris, but uris are not transferable across the workspaces)
    const isSingleSelect = useIsSingleSelect(props.filter);

    return isSingleSelect ? (
        <SingleSelectAttributeFilter {...attributeFilterProps} />
    ) : (
        <AttributeFilterButton {...attributeFilterProps} />
    );
}
