// (C) 2022 GoodData Corporation
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Bubble } from "@gooddata/sdk-ui-kit";
import GroupIcon from "./icons/GroupIcon.js";
import ChevronIcon from "./icons/ChevronIcon.js";
import CircleIcon from "./icons/CircleIcon.js";
import "./bubble.css";
import { IInsightWidget } from "@gooddata/sdk-model";
import { useHideWidgetTitle } from "./useHideWidgetTitle.js";

export interface ICustomHeaderProps {
    selectedIdentifier: string;
    hideColumn: boolean;
    groupInsightsIdentifiers: string[];
    onGroupInsightSelected: (identifier: string) => void;
    widgetTitles: { [insightIdentifier: string]: string };
    widget: IInsightWidget;
}

const StyledTitleOuter = styled.div`
    width: 100%;
    padding-right: 15px;
    margin-top: 10px;
`;

const StyledTitle = styled.div`
    color: var(--gd-dashboards-content-kpiWidget-title-color);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 17px;

    span {
        cursor: pointer;
    }
`;

const StyledBubbleContent = styled.div`
    padding: 10px 0;

    .gd-list-item {
        font-size: 14px;
        padding: 4px 15px;
        display: block;
    }
`;

const StyledBulletList = styled.div`
    line-height: 14px;

    svg {
        vertical-align: middle;
    }
`;

function setColumnVisibilityByChildId(childId: string, visible: boolean) {
    const el = document.getElementById(childId);
    let currentTraversingEl = el;
    while (currentTraversingEl) {
        if (currentTraversingEl.className.includes("gd-fluidlayout-column")) {
            if (visible) {
                currentTraversingEl.style.opacity = "1";
                currentTraversingEl.style.position = "relative";
                currentTraversingEl.style.pointerEvents = "auto";
            } else {
                currentTraversingEl.style.opacity = "0";
                currentTraversingEl.style.position = "absolute";
                currentTraversingEl.style.pointerEvents = "none";
            }
        }
        currentTraversingEl = currentTraversingEl.parentElement;
    }
}

export const GroupedWidgetHeader: React.VFC<ICustomHeaderProps> = ({
    hideColumn,
    groupInsightsIdentifiers,
    onGroupInsightSelected,
    widgetTitles,
    selectedIdentifier,
    widget,
}) => {
    const randomId = useMemo(() => "cls_" + (Math.random() * 10e20).toString(10), []);
    const [bubbleOpen, setBubbleOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    setColumnVisibilityByChildId(randomId, !hideColumn);

    // hiding the insight title
    useHideWidgetTitle(widget);

    const iconsColor = bubbleOpen
        ? "var(--gd-palette-primary-base)"
        : hovered
        ? "var(--gd-dashboards-content-widget-title-color)"
        : "var(--gd-modal-outsideBackgroundColor)";

    return (
        <>
            <StyledTitleOuter onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <StyledTitle>
                    <span id={randomId} onClick={() => setBubbleOpen(!bubbleOpen)}>
                        <GroupIcon style={{ verticalAlign: "middle" }} color={iconsColor} />
                        {widgetTitles[selectedIdentifier]}
                        <ChevronIcon
                            style={{ verticalAlign: "middle" }}
                            rotation={bubbleOpen ? 180 : 0}
                            color={iconsColor}
                        />
                    </span>
                    <StyledBulletList>
                        {groupInsightsIdentifiers.map((identifier) => {
                            const isSelected = identifier === selectedIdentifier;
                            const height = isSelected ? 8 : 6;
                            const color = isSelected
                                ? "var(--gd-palette-primary-base)"
                                : "var(--gd-modal-borderColor)";
                            return <CircleIcon width={17} height={height} color={color} key={identifier} />;
                        })}
                    </StyledBulletList>
                </StyledTitle>
            </StyledTitleOuter>

            {bubbleOpen && (
                <Bubble
                    alignTo={`#${randomId}`}
                    alignPoints={[{ align: "bc tc" }]}
                    className="bubble-light options-menu-bubble plugin-group-bubble"
                >
                    <StyledBubbleContent>
                        {groupInsightsIdentifiers.map((item) => {
                            return (
                                <div
                                    key={item}
                                    className={`gd-list-item ${
                                        item === selectedIdentifier ? "is-selected" : ""
                                    }`}
                                    onClick={() => {
                                        setBubbleOpen(false);
                                        onGroupInsightSelected(item);
                                    }}
                                >
                                    {widgetTitles[item]}
                                </div>
                            );
                        })}
                    </StyledBubbleContent>
                </Bubble>
            )}
        </>
    );
};
