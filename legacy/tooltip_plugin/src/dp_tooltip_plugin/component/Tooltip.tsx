// (C) 2022-2023 GoodData Corporation
import React from "react";
import Tippy from "@tippyjs/react";

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
