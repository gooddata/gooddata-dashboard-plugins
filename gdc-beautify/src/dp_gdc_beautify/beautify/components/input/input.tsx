import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import classNames from "classnames/bind";

import styles from "./input.scss";

const cx = classNames.bind(styles);

export const Input = ({ value, onChange }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
            }}
        >
            <TextField
                helperText="Value in px"
                value={value}
                onChange={({ target: { value } }) => onChange(Number(value))}
                className={cx("input")}
                id="demo-helper-text-aligned-no-helper"
            />
        </Box>
    );
};
