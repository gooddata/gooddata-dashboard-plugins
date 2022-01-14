// (C) 2021 GoodData Corporation
import React, { FC, useState } from "react";
import classNames from "classnames/bind";
// import { DashboardView } from "@gooddata/sdk-ui-ext";

import styles from "./home.scss";

import { Sidebar } from "../../components/sidebar";
// import { DASHBOARD_ID, WORKSPACE_ID } from "~constants";

const cx = classNames.bind(styles);

export const Home: FC = () => {
    const [reloadIframe, setReloadIframe] = useState(0);
    return (
        <div className={cx("home")}>
            <Sidebar
                onSubmit={() => setReloadIframe(reloadIframe + 1)}
                classNames={cx("sidebar")}
            />
            <div className={cx("dashboard")}>
                {/* <iframe
                    key={reloadIframe}
                    src="https://internaltraining.na.gooddata.com/dashboards/embedded/#/workspace/nhf9oxqkkgvspwn0gl4d7ejm9z5c37gp/dashboard/abkCwyNWI6Pe?showNavigation=true" // TODO: refactor
                    width="100%"
                    frameBorder="0"
                /> */}
            </div>
        </div>
    );
};
