// (C) 2021 GoodData Corporation
import { CSSProperties, MouseEventHandler } from "react";

export type TextPreset =
    | "Title1"
    | "Title2"
    | "Heading1"
    | "Heading2"
    | "Heading3"
    | "Heading4"
    | "Heading5"
    | "BoldCaps16"
    | "BoldCaps12"
    | "ParagraphRegular18"
    | "ParagraphRegular16"
    | "ParagraphRegular12"
    | "ParagraphMedium18"
    | "ParagraphMedium16"
    | "ParagraphMedium12";

export type TextPresetProps = Pick<
    IProps,
    "Element" | "uppercase" | "size" | "font" | "spacing" | "inline" | "color"
>;

export interface IProps {
    preset?: TextPreset;

    Element?: "h1" | "h2" | "h3" | "h4" | "h5" | "span" | "p";
    font?: "extra-light" | "light" | "regular" | "medium" | "bold";
    spacing?: "S" | "M" | "L"; // margin-bottom: S - 8px, M - 16px, L - 24px
    color?: "main-light" | "main-dark" | "secondary";
    size?: 12 | 16 | 18 | 20 | 24 | 28 | 36 | 48 | 60 | 84;
    uppercase?: boolean;
    inline?: boolean;
    noSpacing?: boolean;
    className?: string;
    style?: CSSProperties;
    onDoubleClick?: MouseEventHandler<HTMLHeadingElement>;
    onClick?: MouseEventHandler<HTMLHeadingElement>;
}

export interface IStoryProps extends IProps {
    content: string;
}

export type TextPresetsMap = {
    [key in TextPreset]: TextPresetProps;
};
