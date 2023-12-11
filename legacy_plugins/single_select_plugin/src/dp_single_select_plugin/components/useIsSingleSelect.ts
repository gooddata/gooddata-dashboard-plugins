// (C) 2021-2023 GoodData Corporation
import { useDashboardSelector, selectAttributeFilterDisplayForms } from "@gooddata/sdk-ui-dashboard";
import { areObjRefsEqual, IDashboardAttributeFilter } from "@gooddata/sdk-model";

import { SINGLE_SELECT_DISPLAY_FORM_IDENTIFIERS } from "../config.js";

/**
 * Checks whether the dashboard attribute filter should be rendered as a single select.
 * To configure identifiers of the display forms that should be rendered as a single select,
 * modify the content of the `../config.ts file.
 *
 * Note: instead of doing this check inside the attribute filter provider,
 * we are doing it inside the component, so we can do the comparison by identifier, instead of the ObjRef.
 * (eg., on GoodData Platform backend, filter display forms are stored as uris,
 * but uris are not transferable across the workspaces)
 *
 * @param filter - dashboard attribute filter
 * @returns boolean
 */
export function useIsSingleSelect(filter: IDashboardAttributeFilter): boolean {
    const attributeDisplayForms = useDashboardSelector(selectAttributeFilterDisplayForms);
    const displayForm = attributeDisplayForms.find((df) =>
        areObjRefsEqual(df.ref, filter.attributeFilter.displayForm),
    );
    return SINGLE_SELECT_DISPLAY_FORM_IDENTIFIERS.some((id) => id === displayForm?.id);
}
