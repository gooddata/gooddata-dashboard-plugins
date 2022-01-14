// (C) 2021 GoodData Corporation
import { FieldInputProps, FieldMetaProps } from "formik";

export interface ITabProps {
    getFieldMeta: (name: string) => FieldMetaProps<any>;
    getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
    setFieldValue: any;
}
