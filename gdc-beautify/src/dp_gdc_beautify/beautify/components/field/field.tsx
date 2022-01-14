// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import { TextField } from "@mui/material";

import { IProps } from "./interface";

export const Field: FC<IProps> = ({
    className,
    label,
    disabled,
    placeholder = "",
    value,
    onChange,
    onBlur,
    error,
    touched,
    type,
    name,
    required,
}) => {
    return (
        <TextField
            label={label}
            name={name}
            disabled={disabled}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={touched && !!error}
            helperText={touched && error}
            className={className}
            required={required}
        />
    );
};
