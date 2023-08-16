// (C) 2022-2023 GoodData Corporation
import React from "react";
import classNames from "classnames";

import CircleIcon from "./icons/CircleIcon";

import "./GroupedWidgetDotsList.css";

export interface ICustomHeaderDotsListProps {
    selectedIdentifier: string;
    groupInsightsIdentifiers: string[];
    onGroupInsightSelected: (identifier: string) => void;
    colors: string[];
}

export const GroupedWidgetDotsList: React.VFC<ICustomHeaderDotsListProps> = ({
    groupInsightsIdentifiers,
    selectedIdentifier,
    onGroupInsightSelected,
    colors,
}) => {
    return (
        <div className="plugin-insight-groups-header-list">
            {groupInsightsIdentifiers.map((identifier) => (
                <span
                    key={identifier}
                    className={classNames("plugin-insight-groups-header-list-item", {
                        clickable: identifier !== selectedIdentifier,
                    })}
                    onClick={() => identifier !== selectedIdentifier && onGroupInsightSelected(identifier)}
                >
                    <CircleIcon
                        className={classNames("plugin-insight-groups-circle-icon", {
                            selected: identifier === selectedIdentifier,
                        })}
                        key={identifier}
                        color={identifier === selectedIdentifier ? colors[0] : colors[1]}
                    />
                </span>
            ))}
        </div>
    );
};
