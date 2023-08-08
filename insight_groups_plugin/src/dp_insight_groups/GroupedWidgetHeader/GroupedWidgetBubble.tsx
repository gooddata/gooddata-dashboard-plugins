// (C) 2022-2023 GoodData Corporation
import React from "react";
import { Bubble } from "@gooddata/sdk-ui-kit";
import classNames from "classnames";

import "./GroupedWidgetBubble.css";

export interface ICustomHeaderBubbleProps {
    alignTo: string;
    selectedIdentifier: string;
    groupInsightsIdentifiers: string[];
    widgetTitles: { [insightIdentifier: string]: string };
    onGroupInsightSelected: (identifier: string) => void;
    onClose: () => void;
}

export const GroupedWidgetBubble: React.VFC<ICustomHeaderBubbleProps> = ({
    alignTo,
    groupInsightsIdentifiers,
    widgetTitles,
    selectedIdentifier,
    onGroupInsightSelected,
    onClose,
}) => {
    return (
        <Bubble
            alignTo={`#${alignTo}`}
            alignPoints={[{ align: "bc tc" }]}
            className="bubble-light options-menu-bubble plugin-insight-groups-bubble"
            closeOnOutsideClick={true}
            onClose={onClose}
        >
            <div className="plugin-insight-groups-bubble-content">
                {groupInsightsIdentifiers.map((item) => (
                    <div
                        key={item}
                        className={classNames("gd-list-item", { "is-selected": item === selectedIdentifier })}
                        onClick={() => onGroupInsightSelected(item)}
                    >
                        {widgetTitles[item]}
                    </div>
                ))}
            </div>
        </Bubble>
    );
};
