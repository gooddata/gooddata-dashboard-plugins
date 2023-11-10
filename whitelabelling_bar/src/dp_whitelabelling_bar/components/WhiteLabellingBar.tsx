// (C) 2023 GoodData Corporation

import React, { CSSProperties, useMemo, useRef, useState } from "react";
import {
    CustomDashboardWidgetComponent,
    ICustomWidget,
    selectIsExport,
    useDashboardSelector,
} from "@gooddata/sdk-ui-dashboard";
import useResizeObserverDefault from "use-resize-observer";

import { DASHBOARD_CONTENT_ROOT_CLASS_NAME } from "../constants.js";

// There are known compatibility issues between CommonJS (CJS) and ECMAScript modules (ESM).
// In ESM, default exports of CJS modules are wrapped in default properties instead of being exposed directly.
// https://github.com/microsoft/TypeScript/issues/52086#issuecomment-1385978414
const useResizeObserver = useResizeObserverDefault as unknown as typeof useResizeObserverDefault.default;

export interface IWhiteLabellingBarWidgetExtras {
    text?: string;
    logoUrl?: string;
    logoAltText?: string;
}

type WhiteLabellingBarWidgetProps = ICustomWidget & IWhiteLabellingBarWidgetExtras;

/**
 * Adds a bar with fixed position at the bottom of the dashboard,
 * the resize observer is used to keep the component at the same width as the dashboard
 */
export const WhiteLabellingBar: CustomDashboardWidgetComponent = ({ widget }) => {
    const { text, logoUrl, logoAltText = "" } = widget as WhiteLabellingBarWidgetProps;
    const isExport = useDashboardSelector(selectIsExport);

    const [width, setWidth] = useState<CSSProperties["width"]>("100%");

    const dashboardRootRef = useRef(
        document.getElementsByClassName(DASHBOARD_CONTENT_ROOT_CLASS_NAME)[0] as HTMLElement,
    );

    useResizeObserver<HTMLElement>({
        ref: dashboardRootRef,
        onResize: ({ width: dashboardRootWidth }) => setWidth(dashboardRootWidth),
    });

    const styles: Record<string, CSSProperties> = useMemo(
        () => ({
            root: {
                position: "fixed",
                bottom: 0,
                right: 0,
                width: isExport ? "100%" : width,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontSize: "1rem",
                background: "white",
                padding: "0.5rem 0.75rem",
                textAlign: "right",
                borderTop: "1px solid var(--gd-palette-complementary-3, #dde4eb)",
                marginBottom: isExport ? "2.5rem" : 0, // to avoid overlapping page numbers in the PDF export
            },
            image: { height: "1.5rem" },
        }),
        [isExport, width],
    );

    return (
        <div style={styles.root}>
            {text}
            {logoUrl && <img style={styles.image} src={logoUrl} alt={logoAltText} />}
        </div>
    );
};
