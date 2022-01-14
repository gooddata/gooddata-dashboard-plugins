// (C) 2021 GoodData Corporation
import React, { ContextType, createContext, FC, useContext, useEffect, useState } from "react";
import bearFactory, {
    ContextDeferredAuthProvider,
    FixedLoginAndPasswordAuthProvider,
} from "@gooddata/sdk-backend-bear";
import noop from "lodash/noop";
import { IAnalyticalBackend } from "@gooddata/sdk-backend-spi";

import { LOADING_STATE } from "../constants";

const createBackend = (): IAnalyticalBackend => {
    return bearFactory({ hostname: "" }).withAuthentication(new ContextDeferredAuthProvider());
};

const backendWithCredentials = ({
    backend,
    email,
    password,
}: {
    backend: IAnalyticalBackend;
    email: string;
    password: string;
}): IAnalyticalBackend => {
    return backend.withAuthentication(new FixedLoginAndPasswordAuthProvider(email, password));
};

const defaultContext = {
    ...LOADING_STATE,
    isInitialLoading: true,
    backend: createBackend(),
    login: noop,
    logout: noop,
    clearError: noop,
};

const AuthContext = createContext(defaultContext);

export const AuthProvider: FC = ({ children }) => {
    const [backend, setBackend] = useState(defaultContext.backend);
    const [userState, setUserState] = useState({ ...LOADING_STATE, isInitialLoading: true });

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const account = await backend.authenticate();

                setUserState({
                    isInitialLoading: false,
                    error: null,
                    data: account,
                    isLoading: false,
                });
            } catch (error) {
                setUserState({
                    isInitialLoading: false,
                    error: null,
                    data: null,
                    isLoading: false,
                });
            }
        };

        getCurrentUser();
    }, [backend]);

    const login = async ({ email, password }) => {
        setUserState({ isLoading: true, error: null, data: null, isInitialLoading: false });
        try {
            const newBackend = backendWithCredentials({ backend, email, password });
            const account = await newBackend.authenticate();
            setBackend(newBackend);
            setUserState({ isLoading: false, error: null, data: account, isInitialLoading: false });
        } catch (error) {
            setUserState({ isLoading: false, error, data: null, isInitialLoading: false });
            throw error;
        }
    };

    const logout = () => {
        setUserState({
            isLoading: false,
            error: null,
            data: null,
            isInitialLoading: false,
        });

        backend.deauthenticate();
    };

    const clearError = () => {
        setUserState({ ...userState, error: null });
    };

    return (
        <AuthContext.Provider value={{ ...userState, backend, login, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): ContextType<typeof AuthContext> => useContext(AuthContext);
