// (C) 2021 GoodData Corporation
import * as Yup from "yup";

const ERRORS = {
    required: "Field is required.",
    email: "Invalid email address.",
    min: (number) => `Must be at least ${number} characters.`,
    passwordVerify: "Passwords must match.",
};

const VALIDATION = {
    firstName: Yup.string().required(ERRORS.required),
    lastName: Yup.string().required(ERRORS.required),
    email: Yup.string().required(ERRORS.required).email(ERRORS.email),
    password: Yup.string().required(ERRORS.required).min(7, ERRORS.min(7)),
    passwordVerify: Yup.string().oneOf([Yup.ref("password"), null], ERRORS.passwordVerify),
};

type AvailableValidationRules = "email" | "password" | "passwordVerify" | "firstName" | "lastName";

export const validate = (validationRules: AvailableValidationRules[]): Yup.ObjectSchema<any> => {
    return Yup.object().shape(
        validationRules.reduce((acc, validationRule) => {
            return Object.assign(acc, { [validationRule]: VALIDATION[validationRule] });
        }, {}),
    );
};
