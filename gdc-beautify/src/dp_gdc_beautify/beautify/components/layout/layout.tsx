// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import classNames from "classnames/bind";

import styles from "./layout.scss";

const cx = classNames.bind(styles);

export const Layout: FC = ({ children }) => {
    return (
        <div className={cx("layout")}>
            <div className={cx("content")}>{children}</div>
        </div>
    );
};
