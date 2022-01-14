// (C) 2021 GoodData Corporation
export interface ILoadingState<V = any> {
    isLoading: boolean;
    error: Error;
    data: V;
}

export const LOADING_STATE: ILoadingState = { isLoading: true, error: null, data: null };
