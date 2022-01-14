// (C) 2021 GoodData Corporation
export const getThemeObjects = (workspace: string): Promise<any> => {
    return fetch(`/gdc/md/${workspace}/query/themes`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    }).then((response) => response.json());
};

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
