// (C) 2021 GoodData Corporation
import { useEffect, useState } from "react";

import { LOADING_STATE } from "../constants";
import { getThemeObjects, genericGetRequest } from "../utils";

export const useCurrentTheme = () => {
    const [requestState, setRequestState] = useState(LOADING_STATE);
    const [link, setLink] = useState(null);

    const onRequestError = (error) => {
        setRequestState({ isLoading: false, data: null, error: error.message });
    };

    useEffect(() => {
        getThemeObjects()
            .then(({ query: { entries } }) => {
                const { link } = entries[0];
                setLink(link);
                genericGetRequest(link)
                    .then((response) => {
                        setRequestState({ isLoading: false, data: response, error: null });
                    })
                    .catch(onRequestError);
            })
            .catch(onRequestError);
    }, []);

    return { ...requestState, link };
};
