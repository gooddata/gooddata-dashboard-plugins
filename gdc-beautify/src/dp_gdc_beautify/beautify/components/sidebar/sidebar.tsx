// (C) 2021 GoodData Corporation
import React,{ FC } from "react";
import classNames from "classnames/bind";

import styles from "./sidebar.scss";
import { IProps } from "./interface";
import { Content } from "./content";

import { useCurrentTheme } from "../../utils/useCurrentTheme";
import { Preloader } from "../../components/preloader";

const cx = classNames.bind(styles);

export const Sidebar: FC<IProps> = ({ classNames, onSubmit }) => {
    const { isLoading, error, data, link } = useCurrentTheme();

    return (
        <div className={cx("sidebar", classNames)}>
            {isLoading ? (
                <Preloader />
            ) : error ? (
                "Failed to get data"
            ) : (
                <Content data={data} onSubmit={onSubmit} link={link} />
            )}
        </div>
    );
};
