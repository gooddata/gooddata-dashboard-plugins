// (C) 2022 GoodData Corporation
import { useMemo } from "react";

export function useId() {
    return useMemo(() => "plugin-insight-groups-id-" + Math.random().toString(36).slice(2), []);
}
