// (C) 2021 GoodData Corporation
import React,{ FC } from "react";
import classNames from "classnames/bind";

import { ITabProps } from "../interface";

import styles from "./insight.scss";

import { ColorPicker } from "../../../../../components/colorPicker";
import { List } from "../../../../../components/sidebar/list";
import { Toggle } from "../../../../../components/toggle";
import { Input } from "../../../../../components/input";

const cx = classNames.bind(styles);

export const Insight: FC<ITabProps> = ({ getFieldMeta, getFieldProps, setFieldValue }) => {
    const FIELDS = [
        {
            label: "KPI widget",
            nestedItems: [
                {
                    label: "Title color",
                    value: "dashboards.content.kpiWidget.title.color",
                    component: "colorPicker",
                },
                {
                    label: "Primary measure color",
                    value: "dashboards.content.kpiWidget.kpi.primaryMeasureColor",
                    component: "colorPicker",
                },
                {
                    label: "Secondary measure color",
                    value: "dashboards.content.kpiWidget.kpi.secondaryInfoColor",
                    component: "colorPicker",
                },
                {
                    label: "Background color",
                    value: "dashboards.content.kpiWidget.backgroundColor",
                    component: "colorPicker",
                },
                {
                    label: "Border color",
                    value: "dashboards.content.kpiWidget.borderColor",
                    component: "colorPicker",
                },
                {
                    label: "Border radius",
                    value: "dashboards.content.kpiWidget.borderRadius",
                    component: "input",
                },
                {
                    label: "Border width",
                    value: "dashboards.content.kpiWidget.borderWidth",
                    component: "input",
                },
                {
                    label: "Drop shadow",
                    value: "dashboards.content.kpiWidget.dropShadow",
                    component: "toggle",
                },
            ],
        },
        {
            label: "Insights",
            nestedItems: [
                {
                    label: "Title color",
                    value: "dashboards.content.widget.title.color",
                    component: "colorPicker",
                },
                {
                    label: "Border color",
                    value: "dashboards.content.widget.borderColor",
                    component: "colorPicker",
                },
                {
                    label: "Border radius",
                    value: "dashboards.content.widget.borderRadius",
                    component: "input",
                },
                {
                    label: "Border width",
                    value: "dashboards.content.widget.borderWidth",
                    component: "input",
                },
                {
                    label: "Drop shadow",
                    value: "dashboards.content.widget.dropShadow",
                    component: "toggle",
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
        <div className={cx("insight-tab")}>
            <h6 className={cx("insight-title")}>INSIGHT STYLING</h6>
            <List data={listConfig} />
        </div>
    );
};
