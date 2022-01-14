// (C) 2021 GoodData Corporation
import React,{ FC } from "react";
import classNames from "classnames/bind";

import { ITabProps } from "../interface";

import styles from "./back.scss";

import { ColorPicker } from "../../../../../components/colorPicker";
import { List } from "../../../../../components/sidebar/list";
import { Toggle } from "../../../../../components/toggle";
import { Input } from "../../../../../components/input";

const cx = classNames.bind(styles);

export const Back: FC<ITabProps> = ({ getFieldMeta, getFieldProps, setFieldValue }) => {
    const FIELDS = [
        {
            label: "Dashboard title section",
            nestedItems: [
                {
                    label: "Color",
                    value: "dashboards.title.color",
                    component: "colorPicker",
                },
                {
                    label: "Area background color",
                    value: "dashboards.title.backgroundColor",
                    component: "colorPicker",
                },
                {
                    label: "Area border color",
                    value: "dashboards.title.borderColor",
                    component: "colorPicker",
                },
            ],
        },
        {
            label: "Filter bar",
            nestedItems: [
                {
                    label: "Filter button background color",
                    value: "dashboards.filterBar.filterButton.backgroundColor",
                    component: "colorPicker",
                },
                {
                    label: "Filter bar background color",
                    value: "dashboards.filterBar.backgroundColor",
                    component: "colorPicker",
                },
                {
                    label: "Filter bar border color",
                    value: "dashboards.filterBar.borderColor",
                    component: "colorPicker",
                },
            ],
        },
        {
            label: "Dashboard background color",
            value: "dashboards.content.backgroundColor",
            component: "colorPicker",
        },
        {
            label: "Dashboard sections",
            nestedItems: [
                {
                    label: "Title color",
                    value: "dashboards.section.title.color",
                    component: "colorPicker",
                },
                {
                    label: "Title line",
                    value: "dashboards.section.title.lineColor",
                    component: "colorPicker",
                },
                {
                    label: "Section description",
                    value: "dashboards.section.description.color",
                    component: "colorPicker",
                },
            ],
        },
    ];

    const renderComponent = ({ value, component, label, nestedItems }) => {
        if (nestedItems) {
        }
        switch (component) {
            case "colorPicker":
                return (
                    <ColorPicker
                        {...getFieldProps(value)}
                        {...getFieldMeta(value)}
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
        <div className={cx("back-tab")}>
            <h6 className={cx("back-title")}>DASHBOARD STYLING</h6>
            <List data={listConfig} />
        </div>
    );
};
