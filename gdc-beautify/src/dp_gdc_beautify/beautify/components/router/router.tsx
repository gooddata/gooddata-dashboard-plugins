// (C) 2021 GoodData Corporation
import React,{ FC } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";

import { Home, NotFound, Login } from "../../pages";
import { ROUTES } from "../../constants";
import { useAuth } from "../../contexts";
import { Preloader } from "../../components/preloader";

export const Router: FC = () => {
    const { pathname } = useLocation();

    const { data, isInitialLoading } = useAuth();

    if (isInitialLoading) {
        return <Preloader size="L" text="Authenticating user. Please wait..." />;
    }

    if (!data && pathname !== ROUTES.LOGIN) {
        return <Redirect to={ROUTES.LOGIN} />;
    }

    if (data && pathname === ROUTES.LOGIN) {
        return <Redirect to={ROUTES.HOME} />;
    }

    return (
        <Switch>
            <Route path={ROUTES.DEFAULT} exact component={() => <Redirect to={ROUTES.HOME} />} />
            <Route path={ROUTES.HOME} exact component={Home} />
            <Route path={ROUTES.LOGIN} exact component={Login} />
            <Route component={NotFound} />
        </Switch>
    );
};
