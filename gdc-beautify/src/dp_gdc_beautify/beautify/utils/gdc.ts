// (C) 2021 GoodData Corporation

import { WORKSPACE_ID } from "../constants";
export const getThemeObjects = (): Promise<any> =>
    fetch(`/gdc/md/${WORKSPACE_ID}/query/themes`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    }).then((response) => response.json());

export const genericGetRequest = (url: string): Promise<any> =>
    fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    }).then((response) => response.json());

export const genericPostRequest = (url: string, data: any): Promise<any> =>
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
