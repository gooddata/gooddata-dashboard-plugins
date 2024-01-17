// (C) 2022-2024 GoodData Corporation
import React, { useMemo } from "react";
import { UseCancelablePromiseStatus } from "@gooddata/sdk-ui";

import { AttributeConfig, PluginMessages } from "../interface.js";
import { TooManyDataPointsError } from "../utils.js";

import { InlineValue } from "./InlineValue.js";

interface IInlineAttributeProps {
    status: UseCancelablePromiseStatus;
    value: string | undefined;
    messages: PluginMessages;
    config: AttributeConfig;
    error: Error | null | undefined;
}

/**
 * The component handles rendering of attributes, and if the attribute is an email or a link,
 * it renders them as such.
 */
export const InlineAttribute: React.FC<IInlineAttributeProps> = ({
    status,
    value = "",
    error,
    messages,
    config: { link, email, ...restConfig },
}) => {
    const displayValue = useMemo(() => {
        if (email) {
            return <a href={`mailto:${value}`}>{value}</a>;
        }
        if (link) {
            return (
                <a href={value} target="_blank" rel="noreferrer">
                    {value}
                </a>
            );
        }

        return value;
    }, [email, link, value]);

    const attributeError = useMemo(() => {
        if (error instanceof TooManyDataPointsError) {
            error.message = messages.tooManyDataPoints;
        }

        return error;
    }, [error, messages.tooManyDataPoints]);

    return (
        <InlineValue
            status={status}
            error={attributeError}
            value={displayValue}
            messages={messages}
            config={restConfig}
        />
    );
};
