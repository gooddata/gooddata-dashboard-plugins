// (C) 2022-2023 GoodData Corporation
import React, { useMemo } from "react";
import cx from "classnames";
import invariant from "ts-invariant";
import ReactMarkdown, { Options } from "react-markdown";
import { CustomDashboardWidgetComponent, ICustomWidget } from "@gooddata/sdk-ui-dashboard";
import { isIdentifierRef, isObjRef, ObjRef } from "@gooddata/sdk-model";

import "./kdDescription.css";

import {
    DescriptionWidgetExtras,
    PlaceholderPrefix,
    ValueConfig,
    ValuePlaceholderInDescription,
} from "../interface.js";
import { useAttributes } from "../hooks/useAttributes.js";

import { InlineMeasure } from "./InlineMeasure.js";
import { InlineAttribute } from "./InlineAttribute.js";
import { getAttributeValue, getMetricRefFromConfig, mergeMessages } from "./utils.js";

/**
 * Dashboard widget that utilizes ReactMarkdown to render a rich text
 * description and integrates with data sources to replace placeholders with
 * actual values in the displayed content.
 */
export const KdDescription: CustomDashboardWidgetComponent = (props) => {
    const widget = props.widget as ICustomWidget & DescriptionWidgetExtras;
    const { description, metrics, wrap, attributes, messages, textAlign } = widget;

    const { attributesInsightId, attributesSlice, attributeConfigs, attributesStatus, attributesError } =
        useAttributes({
            widget,
            attributes,
        });

    const mdComponents: Options["components"] = useMemo(
        () => ({
            // Override default rendering of the code nodes - we are using it for injecting live metrics and attributes into text.
            // Look for the text with format like `metric:<metric name>` and `attribute:<attribute name>`
            code({ node, inline, ...props }) {
                if (
                    !inline ||
                    node.children.length !== 1 ||
                    node.children[0].type !== "text" ||
                    (!node.children[0].value.startsWith(PlaceholderPrefix.Metric) &&
                        !node.children[0].value.startsWith(PlaceholderPrefix.Attribute))
                ) {
                    return <code {...props} />;
                }

                if (node.children[0].value.startsWith(PlaceholderPrefix.Attribute)) {
                    const attributePlaceholder = node.children[0].value.replace(
                        PlaceholderPrefix.Attribute,
                        "",
                    );
                    const { messages: attributeMessages, ...attrConfig } =
                        attributeConfigs?.[attributePlaceholder] ?? {};

                    try {
                        invariant(
                            isObjRef(attrConfig),
                            `Invalid format of the live attribute in text. Attribute: "${node.children[0].value}" from insight "${attributesInsightId?.identifier}". Check if plugin parameters and configuration json are set correctly.`,
                        );
                    } catch (e) {
                        console.error(e);
                        return <code {...props} />;
                    }

                    const attributeValue = getAttributeValue(attrConfig, attributesSlice);

                    if (attributeValue === undefined) {
                        const attributeIdentifier = isIdentifierRef(attrConfig)
                            ? attrConfig.identifier
                            : attrConfig.uri;

                        console.warn(
                            `Value for attribute placeholder "${attributePlaceholder}" ("${attributeIdentifier}") not found in insight "${attributesInsightId?.identifier}".`,
                        );
                    }

                    const effectiveMessages = mergeMessages(messages, attributeMessages);

                    return (
                        <InlineAttribute
                            value={attributeValue}
                            status={attributesStatus}
                            error={attributesError}
                            messages={effectiveMessages}
                            config={attrConfig}
                        />
                    );
                }

                let metricRef: ObjRef;
                const metricPlaceholder = node.children[0].value.replace(PlaceholderPrefix.Metric, "");
                const { messages: metricMessages, ...metricConfig } =
                    metrics?.[metricPlaceholder as ValuePlaceholderInDescription] ?? ({} as ValueConfig);
                try {
                    metricRef = getMetricRefFromConfig(metricConfig); // metric ref has to be split from config for the execution to execute properly

                    invariant(
                        isObjRef(metricRef),
                        `Invalid format of the live metric in text: ${node.children[0].value}`,
                    );
                } catch (e) {
                    console.error(e);

                    return <code {...props} />;
                }

                const effectiveMessages = mergeMessages(messages, metricMessages);

                return (
                    <InlineMeasure
                        metricRef={metricRef}
                        widget={widget}
                        config={metricConfig}
                        messages={effectiveMessages}
                    />
                );
            },
        }),
        [
            widget,
            messages,
            attributesSlice,
            attributesStatus,
            attributesError,
            attributeConfigs,
            attributesInsightId?.identifier,
            metrics,
        ],
    );

    const dynamicStyles = useMemo(() => ({ textAlign }), [textAlign]);

    return (
        <div className={cx("description-wrapper", { wrap })} style={dynamicStyles}>
            <ReactMarkdown linkTarget="_blank" components={mdComponents}>
                {description}
            </ReactMarkdown>
        </div>
    );
};
