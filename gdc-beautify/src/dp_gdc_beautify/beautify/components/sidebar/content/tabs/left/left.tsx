// (C) 2021 GoodData Corporation
import React,{ FC } from "react";
import classNames from "classnames/bind";

import { ITabProps } from "../interface";

import styles from "./left.scss";

import { ColorPicker } from "../../../../../components/colorPicker";
import { List } from "../../../../../components/sidebar/list";
import { Toggle } from "../../../../../components/toggle";
import { Input } from "../../../../../components/input";

const cx = classNames.bind(styles);

export const Left: FC<ITabProps> = ({ getFieldMeta, getFieldProps, setFieldValue }) => {
    const FIELDS = [
        {
            label: "Title color",
            value: "dashboards.navigation.title.color",
            component: "colorPicker",
        },
        {
            label: "Item color",
            value: "dashboards.navigation.item.color",
            component: "colorPicker",
        },
        {
            label: "Item color on hover",
            value: "dashboards.navigation.item.hoverColor",
            component: "colorPicker",
        },
        {
            label: "Selected item color",
            value: "dashboards.navigation.item.selectedColor",
            component: "colorPicker",
        },
        {
            label: "Selected item background color",
            value: "dashboards.navigation.item.selectedBackgroundColor",
            component: "colorPicker",
        },
        {
            label: "Navigation panel border color",
            value: "dashboards.navigation.borderColor",
            component: "colorPicker",
        },
        {
            label: "Navigation panel background color",
            value: "dashboards.navigation.backgroundColor",
            itemClass: ".navigation.s-navigation",
            styling: "backgroundColor",
            component: "colorPicker",
        },
    ];

    const renderComponent = ({ value, component, label, nestedItems, itemClass, styling }) => {
        if (nestedItems) {
        }
        switch (component) {
            case "colorPicker":
                return (
                    <ColorPicker
                        {...getFieldProps(value)}
                        {...getFieldMeta(value)}
                        itemClass={itemClass}
                        styling={styling}
                        onChange={(val) => setFieldValue(value, val)}
                    />
                );
            case "toggle":
                return (
                    <Toggle
                        label={label}
                        {...getFieldProps(value)}
                        {...getFieldMeta(value)}
                        onChange={(val) => setFieldValue(value, val)}
                    />
                );
            case "input":
                return (
                    <Input
                        {...getFieldProps(value)}
                        {...getFieldMeta(value)}
                        onChange={(val) => setFieldValue(value, val)}
                    />
                );
        }
    };

    const listConfig = FIELDS.map((field) =>
        field?.nestedItems
            ? {
                  label: field.label,
                  items: field.nestedItems.map((nestedItem) => ({
                      label: nestedItem.label,
                      Component: renderComponent(nestedItem),
                  })),
              }
            : {
                  label: field.label,
                  Component: renderComponent(field),
              },
    );

    return (
        <div className={cx("left-tab")}>
            <h6 className={cx("left-title")}>LEFT NAVIGATION</h6>
            <List data={listConfig} />
        </div>
    );
};
