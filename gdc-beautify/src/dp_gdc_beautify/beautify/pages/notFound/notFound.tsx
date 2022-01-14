// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import classNames from "classnames/bind";

import styles from "./notFound.scss";

const cx = classNames.bind(styles);

export const NotFound: FC = () => {
    return <div className={cx("not-found")}>not found</div>;
};
