// (C) 2021 GoodData Corporation
import { useEffect, useState } from "react";

import { LOADING_STATE } from "../constants";
import { getThemeObjects, genericGetRequest } from "./gdc";
import { useWorkspace } from "@gooddata/sdk-ui";

export const useCurrentTheme = () => {
    const workspace = useWorkspace();
    const [requestState, setRequestState] = useState(LOADING_STATE);
    const [link, setLink] = useState(null);

    const onRequestError = (error) => {
        setRequestState({ isLoading: false, data: null, error: error.message });
    };

    useEffect(() => {
        getThemeObjects(workspace)
            .then(({ query: { entries } }) => {
                const { link } = entries[0];
                setLink(link);
                genericGetRequest(link)
                    .then((response) => {
                        setRequestState({
                            isLoading: false,
                            data: response,
                            error: null,
                        });
                    })
                    .catch(onRequestError);
            })
            .catch(onRequestError);
    }, []);

    return { ...requestState, link };
};
