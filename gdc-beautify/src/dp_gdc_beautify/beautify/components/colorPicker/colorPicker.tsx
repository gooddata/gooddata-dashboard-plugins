// (C) 2021 GoodData Corporation
import React, { FC, useRef, useState } from "react";
import { BlockPicker } from "react-color";
import classNames from "classnames/bind";

import styles from "./colorPicker.scss";
import { IProps } from "./interface";

import { useOutsideClickHandler } from "../../utils";

const cx = classNames.bind(styles);

const PRESET_COLORS = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#000000",
    "#404040",
    "#808080",
    "#b3b3b3",
    "#ffffff",
];

export const ColorPicker: FC<IProps> = ({ value, onChange, itemClass, styling }) => {
    const ref = useRef(null);
    const [opened, setOpened] = useState(false);

    const closePicker = () => {
        setOpened(false);
    };

    const onClick = () => {
        setOpened(!opened);
    };

    useOutsideClickHandler({
        ref,
        onOutsideClick: closePicker,
    });

    const onChangeColor = ({ hex }) => {
        onChange(hex);
        closePicker();
        const element = document.querySelector("iframe").contentWindow.document.querySelector(itemClass);
        console.log("🚀 ~ file: colorPicker.tsx ~ line 58 ~ onChangeColor ~ element", element, itemClass, document.querySelector(itemClass))
        if (element) {
            element.style[styling] = hex;
        }
    };

    console.log(document.querySelector(itemClass))

    return (
        <div
            className={cx("color-picker")}
            style={{ backgroundColor: value }}
            ref={ref}
            onClick={onClick}
        >
            {opened && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <BlockPicker
                        className={cx("picker")}
                        onChange={onChangeColor}
                        colors={PRESET_COLORS}
                        color={value}
                    />
                </div>
            )}
        </div>
    );
};
