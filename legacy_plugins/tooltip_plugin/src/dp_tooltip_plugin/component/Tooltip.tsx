// (C) 2022-2023 GoodData Corporation
import React from "react";
import TippyDefault from "@tippyjs/react";

// There are known compatibility issues between CommonJS (CJS) and ECMAScript modules (ESM).
// In ESM, default exports of CJS modules are wrapped in default properties instead of being exposed directly.
// https://github.com/microsoft/TypeScript/issues/52086#issuecomment-1385978414
const Tippy = TippyDefault as unknown as typeof TippyDefault.default;

import "./tooltip.css";

/**
 * Tooltip component properties.
 */
interface ITooltipProps {
    /**
     * Identifier of the widget to render tooltip for.
     */
    widgetIdentifier: string;
    /**
     * Text of the tooltip.
     */
    tooltipText: string;
}

export const Tooltip: React.FC<ITooltipProps> = ({ widgetIdentifier, tooltipText }) => {
    return (
        <div key={widgetIdentifier} className="tippy-container">
            <Tippy content={tooltipText}>
                <div className="tooltip-icon gd-icon-circle-question__container">
                    <span className="gd-icon-circle-question" />
                </div>
            </Tippy>
        </div>
    );
};
