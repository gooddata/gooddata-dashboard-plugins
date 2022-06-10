// (C) 2022 GoodData Corporation
import React from "react";
import {
    ICustomWidget,
    CustomDashboardWidgetComponent,
} from "@gooddata/sdk-ui-dashboard";
import invariant from "ts-invariant";

import "./kdDescription.css";
import ReactMarkdown from "react-markdown";
import {InlineMeasure} from './InlineMeasure';
import {isObjRef, ObjRef} from "@gooddata/sdk-model";

export interface IWidgetExtras {
    description: string;
    metrics: {[name: string]: ObjRef};
}

export const KdDescription: CustomDashboardWidgetComponent = (props) => {
    const widget = props.widget as ICustomWidget & IWidgetExtras;
    const {description, metrics} = widget;

    return (
        <div className="wrap">
            <ReactMarkdown
                children={description ?? ""}
                components={{
                    // Override default rendering of the code nodes - we are using it for injecting live metrics into text.
                    // Look for the text with format like `metric:<metric name>`
                    code({node, inline, ...props}) {
                        if (!inline || node.children.length !== 1 || node.children[0].type !== "text" || !node.children[0].value.startsWith("metric:")) {
                            return <code {...props} />;
                        }

                        let metricRef;
                        try {
                            metricRef = metrics[node.children[0].value.replace(/^metric:/, "")];

                            invariant(isObjRef(metricRef), `Invalid format of the live metric in text: ${node.children[0].value}`);
                        } catch (e) {
                            console.error(e);

                            return <code {...props} />;
                        }

                        return <InlineMeasure
                            metricRef={metricRef}
                            widget={widget}
                        />;
                    },
                }}
            />
        </div>
    );
};
