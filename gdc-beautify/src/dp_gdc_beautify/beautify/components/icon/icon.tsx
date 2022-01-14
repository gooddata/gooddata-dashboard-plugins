// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import classNames from "classnames/bind";
import parser from "html-react-parser";

import { IProps } from "./interface";
import styles from "./icon.scss";

const cx = classNames.bind(styles);

export const Icon: FC<IProps> = ({ className, size = "XL", Icon: SvgIcon }) => {
    return (
        <span className={cx("icon", { [`size-${size}`]: true }, className)}>
            {parser(SvgIcon)}
        </span>
    );
};
