// (C) 2022 GoodData Corporation
import React, { useState, useRef } from "react";
import classNames from "classnames";

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
                    >
                        <GroupIcon className="plugin-insight-groups-group-icon" />
                        {widgetTitles[selectedIdentifier]}
                        <ChevronIcon className="plugin-insight-groups-chevron-icon" />
                    </span>
                    <GroupedWidgetDotsList
                        selectedIdentifier={selectedIdentifier}
                        groupInsightsIdentifiers={groupInsightsIdentifiers}
                        onGroupInsightSelected={onGroupInsightSelected}
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
