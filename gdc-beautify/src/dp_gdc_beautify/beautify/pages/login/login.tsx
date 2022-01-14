// (C) 2021 GoodData Corporation
import React, { FC } from "react";
import { useFormik } from "formik";
import classNames from "classnames/bind";
import { Button } from "@mui/material";

import styles from "./login.scss";

import { Text } from "../../components/text";
import { validate } from "../../utils";
import { Preloader } from "../../components/preloader";
import { useAuth } from "../../contexts";
import { Field } from "../../components/field";

// import Logo from "./../../../Logo.png";

const cx = classNames.bind(styles);

const FIELDS = {
    EMAIL: "email",
    PASSWORD: "password",
};

export const Login: FC = () => {
    const { login, isLoading, error, clearError } = useAuth();
    const { getFieldProps, handleSubmit, getFieldMeta } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: validate(["email", "password"]),
        onSubmit: (formValues) => {
            login(formValues);
        },
    });

    return (
        <div className={cx("login-container")}>
            {/* <img className={cx("login-logo")} src={Logo} /> */}
            <div className={cx("login")}>
                <form
                    onSubmit={handleSubmit}
                    onChange={clearError}
                    noValidate
                    className={cx("form")}
                >
                    <Text preset="Heading4" className={cx("text")}>
                        Please login
                    </Text>
                    <Field
                        label="Your Email"
                        disabled={isLoading}
                        placeholder="example@mail.com"
                        className={cx("field")}
                        required
                        {...getFieldMeta(FIELDS.EMAIL)}
                        {...getFieldProps(FIELDS.EMAIL)}
                    />
                    <Field
                        label="Password"
                        disabled={isLoading}
                        type="password"
                        placeholder="Enter Your Password"
                        className={cx("field")}
                        required
                        {...getFieldMeta(FIELDS.PASSWORD)}
                        {...getFieldProps(FIELDS.PASSWORD)}
                    />
                    <div className={cx("controls")}>
                        {isLoading ? (
                            <Preloader />
                        ) : (
                            <>
                                {error ? (
                                    <Text className={cx("error")}>
                                        Invalid email or password. Please try again.
                                    </Text>
                                ) : (
                                    <Button className={cx("button")} type="submit">
                                        Log In
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
