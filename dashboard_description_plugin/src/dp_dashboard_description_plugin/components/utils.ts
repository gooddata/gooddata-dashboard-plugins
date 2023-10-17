// (C) 2023 GoodData Corporation

import { idRef, isIdentifierRef, ObjRef, uriRef } from "@gooddata/sdk-model";
import { IDataSlice } from "@gooddata/sdk-ui";

import { PluginMessages, ValueConfig, ValueWrapper } from "../interface.js";

export const getMetricRefFromConfig = (metricConfig: ValueConfig) =>
    isIdentifierRef(metricConfig)
        ? idRef(metricConfig.identifier, metricConfig.type || "measure") // the measure type is needed in Tiger/Panther
        : uriRef(metricConfig.uri);

export const getAttributeValue = (
    attributeDisplayFormIdRef: ObjRef,
    dataSlice: IDataSlice | null,
): string | undefined => {
    if (!dataSlice) {
        return "";
    }
    const valueIdx = dataSlice.descriptor.descriptors
        .map(({ attributeHeader }) => attributeHeader)
        .findIndex(({ identifier, uri }) => {
            if (isIdentifierRef(attributeDisplayFormIdRef)) {
                return identifier === attributeDisplayFormIdRef.identifier;
            } else {
                return uri === attributeDisplayFormIdRef.uri;
            }
        });

    const attributeValue = dataSlice.sliceTitles()[valueIdx];

    return attributeValue === null ? "" : attributeValue;
};

export const isValidWrapper = (wrapper?: ValueWrapper): wrapper is ValueWrapper => wrapper?.length === 2;

export const mergeMessages = (globalMessages: PluginMessages, itemMessages?: PluginMessages) =>
    itemMessages ? { ...globalMessages, ...itemMessages } : globalMessages;
