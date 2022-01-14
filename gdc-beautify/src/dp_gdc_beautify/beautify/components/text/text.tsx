// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import classNames from "classnames/bind";

import { IProps, TextPresetsMap, TextPresetProps } from "./interface";
import styles from "./text.scss";

const cx = classNames.bind(styles);

const presets: TextPresetsMap = {
    Title1: {
        Element: "span",
        size: 84,
        font: "extra-light",
        spacing: "M",
    },
    Title2: {
        Element: "span",
        size: 60,
        font: "extra-light",
        spacing: "M",
    },
    Heading1: {
        Element: "h1",
        size: 48,
        font: "light",
        spacing: "M",
    },
    Heading2: {
        Element: "h2",
        size: 36,
        font: "light",
        spacing: "M",
    },
    Heading3: {
        Element: "h3",
        size: 28,
        font: "light",
        spacing: "M",
    },
    Heading4: {
        Element: "h4",
        size: 24,
        font: "light",
        spacing: "M",
    },
    Heading5: {
        Element: "h5",
        size: 20,
        font: "regular",
        spacing: "M",
    },
    BoldCaps16: {
        Element: "span",
        font: "bold",
        uppercase: true,
        size: 16,
    },
    BoldCaps12: {
        Element: "span",
        font: "bold",
        uppercase: true,
        size: 12,
    },
    ParagraphRegular18: {
        Element: "p",
        font: "regular",
        size: 18,
        spacing: "L",
    },
    ParagraphRegular16: {
        Element: "p",
        font: "regular",
        size: 16,
        spacing: "L",
    },
    ParagraphRegular12: {
        Element: "p",
        font: "regular",
        size: 12,
        spacing: "S",
    },
    ParagraphMedium18: {
        Element: "p",
        font: "medium",
        size: 18,
        spacing: "L",
    },
    ParagraphMedium16: {
        Element: "p",
        font: "medium",
        size: 16,
        spacing: "L",
    },
    ParagraphMedium12: {
        Element: "p",
        font: "medium",
        size: 12,
        spacing: "S",
    },
};

const getPresetClassNames = ({
    size = 16,
    uppercase,
    font = "regular",
    spacing,
    inline,
    color,
}: TextPresetProps) => {
    return {
        text: true,
        [`size-${size}`]: true,
        [`font-${font}`]: true,
        [`spacing-${spacing}`]: true,
        [`color-${color}`]: true,
        uppercase,
        inline,
    };
};

export const Text: FC<IProps> = ({
    children,
    Element = "span",
    preset,
    size,
    font,
    uppercase,
    spacing,
    className,
    inline,
    color,
    noSpacing,
    style,
    onDoubleClick,
    onClick,
}) => {
    const presetClassNames = getPresetClassNames(
        preset ? presets[preset] : { size, font, uppercase, spacing, inline, color },
    );

    return (
        <Element
            style={style}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
            className={cx(presetClassNames, { noSpacing, inline, color }, className)}
        >
            {children}
        </Element>
    );
};
