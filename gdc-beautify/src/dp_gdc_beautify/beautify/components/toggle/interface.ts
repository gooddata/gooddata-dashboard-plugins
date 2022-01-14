// (C) 2021 GoodData Corporation
import { FieldInputProps, FieldMetaProps } from "formik";

export interface IProps extends FieldInputProps<string>, FieldMetaProps<string> {
    label?: string;
}
