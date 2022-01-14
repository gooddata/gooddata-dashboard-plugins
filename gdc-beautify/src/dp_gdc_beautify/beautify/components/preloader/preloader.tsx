// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import classNames from "classnames/bind";

import styles from "./preloader.scss";
import { IProps } from "./interface";

import { Text, TextPreset } from "../../components/text";

const cx = classNames.bind(styles);

const sizeTextMap: { [key: string]: TextPreset } = {
    L: "ParagraphRegular18",
    M: "ParagraphRegular16",
    S: "ParagraphRegular12",
};

export const Preloader: FC<IProps> = ({ className, size = "M", withBackdrop, absolute, text }) => (
    <div className={cx("preloader-wrapper", { withBackdrop, absolute }, className)}>
        {withBackdrop && <div className={cx("backdrop")} />}
        <div className={cx("preloader", { [`size-${size}`]: true })}>
            <div className={cx("preloader-part")} />
            <div className={cx("preloader-part")} />
            <div className={cx("preloader-part")} />
        </div>
        {text && (
            <Text className={cx("text")} preset={sizeTextMap[size]}>
                {text}
            </Text>
        )}
    </div>
);
