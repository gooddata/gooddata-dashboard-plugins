// (C) 2021 GoodData Corporation
import React, { useMemo } from "react";
import { List as MaterialList, Tooltip } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Icon from "@mui/material/Icon";
import classNames from "classnames/bind";

import styles from "./list.scss";

const cx = classNames.bind(styles);

type ListItem = {
    label: string;
    Component?: any;
    items?: { label: string; Component?: any; tooltip?: string }[];
};

export const List = ({ data }: { data: (ListItem | ListItem[])[] }) => {
    const [openItem, setOpenItem] = React.useState("");

    const renderKeys = useMemo(() => {
        return data.map(({ label, Component, items }) => {
            const isItemOpened = openItem === label;

            return (
                <div key={label}>
                    <ListItemButton
                        onClick={() => setOpenItem(isItemOpened ? "" : label)}
                    >
                        <ListItemText
                            className={cx("list-title")}
                            primary={label}
                        />
                        <ListItemIcon className={cx("list-icon")}>
                            {Component}
                        </ListItemIcon>
                        {items?.length &&
                            (isItemOpened ? (
                                <Icon fontSize="large" component={ExpandLess} />
                            ) : (
                                <Icon fontSize="large" component={ExpandMore} />
                            ))}
                    </ListItemButton>
                    {items?.length && (
                        <Collapse
                            in={isItemOpened}
                            timeout="auto"
                            unmountOnExit
                        >
                            <MaterialList component="div" disablePadding>
                                {items.map(
                                    ({
                                        label: subLabel,
                                        Component: SubComponent,
                                        tooltip,
                                    }) => (
                                        <ListItemButton
                                            key={subLabel}
                                            sx={{ pl: 4 }}
                                        >
                                            {tooltip ? (
                                                <Tooltip
                                                    placement="bottom-start"
                                                    title={tooltip}
                                                >
                                                    <ListItemText
                                                        className={cx(
                                                            "list-title"
                                                        )}
                                                        primary={subLabel}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <ListItemText
                                                    className={cx("list-title")}
                                                    primary={subLabel}
                                                />
                                            )}
                                            <ListItemIcon
                                                className={cx("list-icon")}
                                            >
                                                {SubComponent}
                                            </ListItemIcon>
                                        </ListItemButton>
                                    )
                                )}
                            </MaterialList>
                        </Collapse>
                    )}
                </div>
            );
        });
    }, [data, openItem]);

    return (
        <MaterialList
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {renderKeys}
        </MaterialList>
    );
};
