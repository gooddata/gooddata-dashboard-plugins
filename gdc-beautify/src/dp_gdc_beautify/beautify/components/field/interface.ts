// (C) 2021 GoodData Corporation
import { FieldInputProps, FieldMetaProps } from "formik";

export interface IProps extends FieldInputProps<string>, FieldMetaProps<string> {
    className?: string;
    placeholder?: string;
    type?: "text" | "password";
    label: string;
    disabled?: boolean;
    required?: boolean;
}
