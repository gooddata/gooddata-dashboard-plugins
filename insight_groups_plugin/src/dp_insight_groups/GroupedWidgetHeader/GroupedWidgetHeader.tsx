// (C) 2022-2023 GoodData Corporation
import React, { useState, useRef } from "react";
import classNames from "classnames";
import { useTheme } from "@gooddata/sdk-ui-theme-provider";

import GroupIcon from "./icons/GroupIcon";
import ChevronIcon from "./icons/ChevronIcon";
import { useId } from "./hooks/useId";

import { GroupedWidgetBubble } from "./GroupedWidgetBubble";
import { GroupedWidgetDotsList } from "./GroupedWidgetDotsList";
import { setParentColumnVisibility } from "./nativeDom";

import "./GroupedWidgetHeader.css";

export interface ICustomHeaderProps {
    selectedIdentifier: string;
    hideColumn: boolean;
    groupInsightsIdentifiers: string[];
    onGroupInsightSelected: (identifier: string) => void;
    widgetTitles: { [insightIdentifier: string]: string };
}

export const GroupedWidgetHeader: React.VFC<ICustomHeaderProps> = ({
    hideColumn,
    groupInsightsIdentifiers,
    onGroupInsightSelected,
    widgetTitles,
    selectedIdentifier,
}) => {
    const id = useId();
    const ref = useRef<HTMLDivElement | null>(null);
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const theme = useTheme();
    const gdPalettePrimaryBase = theme?.palette?.primary?.base || '#14b2e2';
    const gdModalOutsideBackgroundColor = theme?.modal?.outsideBackgroundColor || '#e5e5e5';
    const gdModalBorderColor = theme?.modal?.borderColor || '#464e56';
    const gdDashboardsContentWidgetTitleColor = theme?.dashboards?.content?.widget?.title?.color || '464e56';

    setParentColumnVisibility(ref, !hideColumn);

    return (
        <>
            <div
                className={classNames("plugin-insight-groups-header-title", { opened: bubbleOpen })}
                ref={ref}
            >
                <div className="plugin-insight-groups-header-title-content">
                    <span
                        id={id}
                        className="plugin-insight-groups-header-title-content-name"
                        onClick={() => setBubbleOpen(!bubbleOpen)}
                        style={{ color: bubbleOpen ? gdPalettePrimaryBase : gdDashboardsContentWidgetTitleColor }}
                    >
                        <GroupIcon
                            className="plugin-insight-groups-group-icon"
                            color={bubbleOpen ? gdPalettePrimaryBase : gdModalOutsideBackgroundColor}
                        />
                        {widgetTitles[selectedIdentifier]}
                        <ChevronIcon
                            className="plugin-insight-groups-chevron-icon"
                            color={bubbleOpen ? gdPalettePrimaryBase : gdModalOutsideBackgroundColor}
                        />
                    </span>
                    <GroupedWidgetDotsList
                        selectedIdentifier={selectedIdentifier}
                        groupInsightsIdentifiers={groupInsightsIdentifiers}
                        onGroupInsightSelected={onGroupInsightSelected}
                        colors={[gdPalettePrimaryBase || '', gdModalBorderColor || '']}
                    />
                </div>
            </div>
            {bubbleOpen && (
                <GroupedWidgetBubble
                    alignTo={id}
                    groupInsightsIdentifiers={groupInsightsIdentifiers}
                    selectedIdentifier={selectedIdentifier}
                    widgetTitles={widgetTitles}
                    onClose={() => setBubbleOpen(false)}
                    onGroupInsightSelected={(item) => {
                        setBubbleOpen(false);
                        onGroupInsightSelected(item);
                    }}
                />
            )}
        </>
    );
};
