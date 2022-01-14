// (C) 2021 GoodData Corporation
import React,{ FC } from "react";
import classNames from "classnames/bind";

import { ITabProps } from "../interface";

import styles from "./general.scss";

import { ColorPicker } from "../../../../../components/colorPicker";
import { List } from "../../../../../components/sidebar/list";
import { Toggle } from "../../../../../components/toggle";
import { Input } from "../../../../../components/input";

const cx = classNames.bind(styles);

export const GeneralTab: FC<ITabProps> = ({ getFieldMeta, getFieldProps, setFieldValue }) => {
    const FIELDS = [
        {
            label: "Highlighted components",
            value: "palette.primary.base",
            component: "colorPicker",
        },
        {
            label: "Error messages",
            value: "palette.error.base",
            component: "colorPicker",
        },
        {
            label: "Success messages",
            value: "palette.success.base",
            component: "colorPicker",
        },
        {
            label: "Warning messages",
            value: "palette.warning.base",
            component: "colorPicker",
        },
        {
            label: "KD colors",
            nestedItems: [
                {
                    label: "Main Components",
                    value: "palette.complementary.c0",
                    component: "colorPicker",
                    tooltip: "Background color of dashboard, widgets, dialogs, etc.",
                },
                {
                    label: "Hover",
                    value: "palette.complementary.c1",
                    component: "colorPicker",
                    tooltip: "Contrast background color",
                },
                {
                    label: "Accent color",
                    value: "palette.complementary.c2",
                    component: "colorPicker",
                    tooltip: "More contrast background color",
                },
                {
                    label: "Borders",
                    value: "palette.complementary.c3",
                    component: "colorPicker",
                    tooltip: "Border light color",
                },
                {
                    label: "C4",
                    value: "palette.complementary.c4",
                    component: "colorPicker",
                    tooltip: "Border medium color",
                },
                {
                    label: "C5",
                    value: "palette.complementary.c5",
                    component: "colorPicker",
                    tooltip: "Text light color, border dark color",
                },
                {
                    label: "Highlight color",
                    value: "palette.complementary.c6",
                    component: "colorPicker",
                    tooltip:
                        "Button on insights, loading graphic, filter menu groups,left menu hover, left | highlighter",
                },
                {
                    label: "Labels",
                    value: "palette.complementary.c7",
                    component: "colorPicker",
                    tooltip:
                        "Filter label, secondary button text, table labels, axis labels, button more on insights on hover, close menu 'x'",
                },
                {
                    label: "C8",
                    value: "palette.complementary.c8",
                    component: "colorPicker",
                    tooltip: "Text color, table content, dropdown item text color",
                },
                {
                    label: "C9",
                    value: "palette.complementary.c9",
                    component: "colorPicker",
                    tooltip:
                        "Text dark color, foreground color, table content, dropdown item text color",
                },
            ],
        },
        {
            label: "Buttons",
            nestedItems: [
                {
                    label: "Border thickness",
                    value: "button.borderRadius",
                    component: "input",
                },
                {
                    label: "Shadow",
                    value: "button.dropShadow",
                    component: "toggle",
                },
            ],
        },
        {
            label: "Tooltip Colors",
            nestedItems: [
                {
                    label: "Text color",
                    value: "tooltip.color",
                    component: "colorPicker",
                },
                {
                    label: "Background color",
                    value: "tooltip.backgroundColor",
                    component: "colorPicker",
                },
            ],
        },
        {
            label: "PopUp window",
            nestedItems: [
                {
                    label: "Title color",
                    value: "modal.title.color",
                    component: "colorPicker",
                },
                {
                    label: "Title line",
                    value: "modal.title.lineColor",
                    component: "colorPicker",
                },
                {
                    label: "Border color",
                    value: "modal.borderColor",
                    component: "colorPicker",
                },
                {
                    label: "Border radius",
                    value: "modal.borderRadius",
                    component: "input",
                },
                {
                    label: "Border width",
                    value: "modal.borderWidth",
                    component: "input",
                },
                {
                    label: "Drop shadow",
                    value: "modal.dropShadow",
                    component: "toggle",
                },
                {
                    label: "Outside background color",
                    value: "modal.outsideBackgroundColor",
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
                      tooltip: nestedItem?.tooltip,
                  })),
              }
            : {
                  label: field.label,
                  Component: renderComponent(field),
              },
    );

    return (
        <div className={cx("general-tab")}>
            <h6 className={cx("general-title")}>GENERAL STYLING</h6>
            <List data={listConfig} />
        </div>
    );
};
