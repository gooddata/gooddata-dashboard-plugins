// (C) 2021 GoodData Corporation
import React, { FC, useState } from "react";
import classNames from "classnames/bind";

import styles from "./app.scss";
import { Button } from "@mui/material";
import { Sidebar } from "../sidebar";

const cx = classNames.bind(styles);

export const App: FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <>
            <Button
                className={cx("button")}
                onClick={toggleSidebar}
                variant="contained"
            >
                Open theming sidebar
            </Button>
            {sidebarOpen && (
                <div className={cx("sidebar")}>
                    <Button onClick={toggleSidebar} variant="contained">
                        Close
                    </Button>
                    <Sidebar onSubmit={() => {}} />
                </div>
            )}
        </>
    );
};
