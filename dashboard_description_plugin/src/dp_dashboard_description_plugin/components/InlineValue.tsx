// (C) 2022-2023 GoodData Corporation
import React, { ReactNode } from "react";
import { isNoDataSdkError, UseCancelablePromiseStatus } from "@gooddata/sdk-ui";
import cx from "classnames";

import { DEFAULT_NO_DATA_PLACEHOLDER, ERROR_PLACEHOLDER } from "../config.js";
import { PluginMessages, ValueConfig } from "../interface.js";

import { Loading } from "./Loading.js";
import { isValidWrapper } from "./utils.js";

interface IInlineValueProps {
    value: string | ReactNode;
    status: UseCancelablePromiseStatus;
    error: Error | null | undefined;
    config: ValueConfig;
    messages: PluginMessages;
    style?: React.CSSProperties;
}

/**
 * Renders corresponding content depending on the status and error,
 * or renders provided value with wrapper.
 */
export const InlineValue: React.FC<IInlineValueProps> = ({
    value,
    status,
    error,
    config: { wrapper, noDataPlaceholder },
    messages: { noData: noDataMessage },
    style,
}) => {
    if (status === "loading" || status === "pending") {
        return <Loading />;
    }

    const noData = error ? isNoDataSdkError(error) : status === "success" && !value;

    if (noData) {
        return (
            <span className={cx(noDataMessage && "help")} title={noDataMessage}>
                {noDataPlaceholder ?? DEFAULT_NO_DATA_PLACEHOLDER}
            </span>
        );
    }

    if (error) {
        return (
            <span className={cx("error", "help")} title={error.message}>
                {ERROR_PLACEHOLDER}
            </span>
        );
    }

    if (isValidWrapper(wrapper)) {
        const [before, after] = wrapper;
        return <span style={style}>{`${before}${value}${after}`}</span>;
    }

    return <span style={style}>{value}</span>;
};
