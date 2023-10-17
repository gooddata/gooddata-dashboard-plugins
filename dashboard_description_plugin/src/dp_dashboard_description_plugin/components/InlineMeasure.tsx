// (C) 2022-2023 GoodData Corporation
import React from "react";
import { ICustomWidget, useCustomWidgetExecutionDataView } from "@gooddata/sdk-ui-dashboard";
import { newMeasure, ObjRef } from "@gooddata/sdk-model";
import { ClientFormatterFacade } from "@gooddata/number-formatter";

import { PluginMessages, ValueConfig } from "../interface.js";

import { InlineValue } from "./InlineValue.js";

interface IInlineMeasureProps {
    metricRef: ObjRef;
    widget: ICustomWidget;
    config: ValueConfig;
    messages: PluginMessages;
}

/**
 * Extracts data points, formats them and renders the result.
 */
export const InlineMeasure: React.FC<IInlineMeasureProps> = ({ metricRef, config, widget, messages }) => {
    const measure = newMeasure(metricRef);
    const { error, result, status } = useCustomWidgetExecutionDataView({
        widget,
        execution: {
            seriesBy: [measure],
        },
    });

    const valueDataPoint = result?.data().series().firstForMeasure(measure).dataPoints()[0];

    const format =
        result?.meta().measureDescriptor(measure.measure.localIdentifier)?.measureHeaderItem.format ?? "";

    const normalizedValue = ClientFormatterFacade.convertValue(valueDataPoint?.rawValue);
    const { colors: style, formattedValue } = ClientFormatterFacade.formatValue(normalizedValue, format);

    return (
        <InlineValue
            value={formattedValue}
            config={config}
            messages={messages}
            status={status}
            error={error}
            style={style}
        />
    );
};
