// (C) 2023 GoodData Corporation

import "bootstrap/dist/css/bootstrap.css";
import React, { useCallback, useState, useEffect, CSSProperties } from "react";
import {
    idRef,
    newNegativeAttributeFilter,
    newRelativeDateFilter,
    newPositiveAttributeFilter,
    uriRef,
    newAbsoluteDateFilter,
    isIdentifierRef,
    isAttributeElementsByRef,
    isMeasure,
    IMeasureMetadataObject,
    IMeasure,
    IMeasureDefinition,
    isMeasureDefinition,
    IAttribute,
} from "@gooddata/sdk-model";
import {
    CustomDashboardInsightComponent,
    useDashboardSelector,
    selectFilterContextFilters,
    selectCurrentUser,
} from "@gooddata/sdk-ui-dashboard";
import { Button, Modal } from "react-bootstrap";
import { useBackend, useWorkspace } from "@gooddata/sdk-ui";
import { ICellRendererParams } from "@ag-grid-community/core";
import { createPortal } from "react-dom";

import { createCellRenderer } from "./pivotTable/src/impl/cell/cellRenderer.js";
import { newWidthForAllColumnsForMeasure, PivotTable } from "./pivotTable/src/index.js";
import { isMeasureMatchByUriOrId } from "./utils/isMeasureMatchByUriOrId.js";

import "./table.css";

import CheckIcon from "./icons/check-circle.svg";
import CloseIcon from "./icons/x.svg";
import XIcon from "./icons/x-circle.svg";

interface IConfig {
    alert?: {
        title?: string;
        errorMessage?: string;
        successMessage?: string;
        successStyle?: CSSProperties;
        errorStyle?: CSSProperties;
        bodyVariable?: string;
    };
    button?: {
        label?: string;
        disabledLabel?: string;
        loadingLabel?: string;
        style?: CSSProperties;
        width?: number;
        disabledStyle?: CSSProperties;
    };
    request: {
        endpointName?: string;
        method: string;
        uri: string;
        disableErrors?: boolean;
    };
    modal?: {
        disabled?: boolean;
        style?: CSSProperties;
        title?: string;
        body?: string;
    };
}

interface IRowParams extends ICellRendererParams {
    uri: string;
}

const PopupBox: React.FC<{
    backgroundColor: string;
    icon: string;
    title?: string;
    body: string;
    style?: CSSProperties;
    onClose: () => void;
}> = ({ backgroundColor, icon, title, body, onClose, style = {} }) => (
    <div className="popup-box" style={{ backgroundColor, ...style }}>
        <img src={CloseIcon} className="close-icon" onClick={onClose} />
        <div className="popup-box-row">
            <img src={icon} className="popup-box-main-icon" />
            <div>
                <p className="popup-box-title">{title}</p>
                <p className="popup-box-body">{body}</p>
            </div>
        </div>
    </div>
);

/**
 * Renders a pivot table with custom column containing a button.
 * Clicking the button opens a modal window, allowing the user to
 * perform a request. The modal includes configurable styles and
 * buttons for closing or sending requests.
 */
export const Table: CustomDashboardInsightComponent = (props) => {
    const { insight, widget } = props;
    const { buckets, sorts: sortBy } = insight.insight;

    const backend = useBackend();
    const workspace = useWorkspace() || "";
    const user = useDashboardSelector(selectCurrentUser);
    const filterContextFilters = useDashboardSelector(selectFilterContextFilters);

    const filters = filterContextFilters.map((filter) => {
        if ("attributeFilter" in filter) {
            const displayForm = filter.attributeFilter.displayForm;

            const identifier = isIdentifierRef(displayForm)
                ? idRef(displayForm.identifier)
                : uriRef(displayForm.uri);

            const elements = isAttributeElementsByRef(filter.attributeFilter.attributeElements)
                ? filter.attributeFilter.attributeElements.uris
                : [];
            if (filter.attributeFilter.negativeSelection) {
                return newNegativeAttributeFilter(identifier, { uris: elements });
            }
            return newPositiveAttributeFilter(identifier, { uris: elements });
        }

        if ("dateFilter" in filter) {
            if (filter.dateFilter.type === "relative") {
                return newRelativeDateFilter(
                    "hgeneralavailability.dataset.dt",
                    filter.dateFilter.granularity,
                    Number(filter.dateFilter.from),
                    Number(filter.dateFilter.to),
                );
            }

            if (filter.dateFilter.type === "absolute") {
                newAbsoluteDateFilter(
                    "hgeneralavailability.dataset.dt",
                    String(filter.dateFilter.from),
                    String(filter.dateFilter.to),
                );
            }
        }
    });

    const [requestError, setRequestError] = useState<{
        title?: string;
        error?: any;
    } | null>(null);
    const [requestSuccess, setRequestSuccess] = useState<{
        title?: string;
        success?: any;
    } | null>(null);
    const [config, setConfig] = useState<IConfig | null>(null);
    const [rowParams, setRowParams] = useState<IRowParams | null>(null);
    const [measureToReplace, setMeasureToReplace] = useState<IMeasureMetadataObject>();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [queryDataParams, setQueryDataParams] = useState<{
        [key: string]: string | number;
    }>({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const clearError = useCallback(() => setRequestError(null), []);
    const clearSuccess = useCallback(() => setRequestSuccess(null), []);

    const attributes = buckets.find(({ localIdentifier }) => localIdentifier === "attribute");
    const attributeItems = attributes?.items as IAttribute[];

    const measures = buckets.find(({ localIdentifier }) => localIdentifier === "measures");
    const measureItems = (measures?.items as IMeasure<IMeasureDefinition>[]).filter((m) =>
        isMeasureDefinition(m.measure.definition),
    );

    const loadTaggedMeasure = async () => {
        const catalog = await backend
            ?.workspace(workspace)
            .catalog()
            .includeTags([idRef("custom_column")])
            .forTypes(["measure"])
            .load();

        if (catalog) {
            const catalogMeasures = catalog.measures();
            const catalogMeasure = catalogMeasures.find(({ measure }) =>
                measureItems?.some((item) => isMeasureMatchByUriOrId(item.measure, measure)),
            );

            setMeasureToReplace(catalogMeasure?.measure);
        }
    };

    const sendRequest = async (params = rowParams) => {
        if (config && params) {
            const { data, uri } = params;

            try {
                setLoading(true);

                const controller = new AbortController();

                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const data: any = await fetch(uri, {
                    method: config.request.method,
                    signal: controller.signal,
                    // mode: 'no-cors'
                });
                clearTimeout(timeoutId);
                setLoading(false);
                setRequestSuccess({
                    title: data?.[config?.alert?.bodyVariable || 0] || "[]",
                    success: data,
                });
            } catch (err) {
                console.error(err, data);
                setLoading(false);
                setRequestError({
                    title: data?.[config?.alert?.bodyVariable || 0] || "[]",
                    error: err,
                });
            } finally {
                handleClose();
            }
        }
    };

    const customColumnContent = (params: ICellRendererParams) => {
        const { valueFormatted } = params;

        const disabled = valueFormatted?.includes("DISABLED_CUSTOM_CONTENT");

        const onClick = () => {
            if (config) {
                let newUri = config.request.uri;
                newUri = newUri.replace("r_username", user.fullName || "");
                for (let index = 0; index < Object.keys(params?.data).length - 1; index++) {
                    newUri = newUri.replace(`r_${index}`, `${params?.data[`r_${index}`]}`);
                }

                const urlSearchParams = new URLSearchParams(new URL(newUri).search);
                const queryParams = Object.fromEntries(urlSearchParams.entries());

                setQueryDataParams(queryParams);
                setRowParams({ ...params, uri: newUri });
                if (config.modal?.disabled) {
                    sendRequest({ ...params, uri: newUri });
                } else {
                    handleShow();
                }
            }
        };

        if (!valueFormatted?.includes("TABLE_CONFIG_START") && !disabled)
            return createCellRenderer()(params, true);
        return (
            <button
                disabled={disabled}
                className="custom-btn"
                style={
                    disabled
                        ? {
                              width: config?.button?.width,
                              ...config?.button?.style,
                              ...config?.button?.disabledStyle,
                          }
                        : { width: config?.button?.width, ...config?.button?.style }
                }
                onClick={onClick}
            >
                {loading
                    ? config?.button?.loadingLabel
                    : disabled && config?.button?.disabledLabel
                    ? config?.button?.disabledLabel
                    : config?.button?.label}
            </button>
        );
    };

    useEffect(() => {
        if (backend && workspace) {
            loadTaggedMeasure();
        }
    }, [backend, workspace]);

    useEffect(() => {
        if (measureToReplace) {
            try {
                const maybeFoundMeasure = measureItems?.find((item) =>
                    isMeasureMatchByUriOrId(item.measure, measureToReplace),
                );
                const measureFormat = isMeasure(maybeFoundMeasure) ? maybeFoundMeasure?.measure?.format : "";

                const measureJSON =
                    measureFormat?.substring(
                        measureFormat.indexOf("TABLE_CONFIG_START") + 18,
                        measureFormat.lastIndexOf("TABLE_CONFIG_END"),
                    ) ?? "";

                const JSONdata = JSON.parse(measureJSON);
                setConfig(JSONdata);
            } catch (e) {}
        }
    }, [measures, measureToReplace]);

    const tableProps = {
        measures: measureItems?.map((item) => {
            if (isMeasureMatchByUriOrId(item.measure, measureToReplace)) {
                return {
                    ...item,
                    customColumn: true,
                };
            }

            return item;
        }),
        rows: attributeItems,
        filters,
        sortBy,
        totals: attributes?.totals,
        config: {
            columnSizing: {
                // defaultWidth: "autoresizeAll",
                growToFit: true,
                columnWidths: measureToReplace
                    ? [
                          ...(widget?.properties?.controls?.columnWidths || []),
                          newWidthForAllColumnsForMeasure(
                              "abB4LrE0jTXs",
                              config?.button?.width || 150,
                              false,
                          ) || [],
                      ]
                    : [],
            },
        },
    };

    return (
        <>
            {requestError &&
                !config?.request?.disableErrors &&
                createPortal(
                    <PopupBox
                        title="ERROR"
                        style={{
                            ...config?.alert?.errorStyle,
                            zIndex: 9999,
                        }}
                        body={config?.alert?.errorMessage || requestError?.error}
                        onClose={clearError}
                        icon={XIcon}
                        backgroundColor="#DC3545"
                    />,
                    document.body,
                )}
            {requestSuccess ||
                (requestError &&
                    config?.request?.disableErrors &&
                    createPortal(
                        <PopupBox
                            title={config?.alert?.title}
                            style={{
                                ...config?.alert?.successStyle,
                                zIndex: 9999,
                            }}
                            body={
                                config?.alert?.successMessage ||
                                `A request for the latest version of ${requestError?.title} has been successfully added to the backlog for processing.`
                            }
                            onClose={() => {
                                clearSuccess();
                                clearError();
                            }}
                            icon={CheckIcon}
                            backgroundColor="#20C997"
                        />,
                        document.body,
                    ))}
            {measureToReplace && (
                <PivotTable {...tableProps} customColumnRenderer={customColumnContent} customPivotButton />
            )}
            <Modal
                show={show}
                onHide={handleClose}
                style={{
                    zIndex: 9999,
                    ...config?.modal?.style,
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{config?.modal?.title || "Request summary"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {config?.modal?.body || (
                        <>
                            <p>Request to update:</p>
                            {Object.entries(queryDataParams).map(([key, value]) => (
                                <p className="m-0" key={key}>
                                    {key}: {value}
                                </p>
                            ))}
                            <p>will be sent to {config?.request?.endpointName || ""} for processing</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => sendRequest()}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
