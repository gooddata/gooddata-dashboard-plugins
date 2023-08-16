// (C) 2022-2023 GoodData Corporation
import React from "react";

const CircleIcon: React.VFC<{ className: string, color?: string }> = ({ className, color }) => (
    <svg width="17" height="6" viewBox="-1 -1 2 2" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle fill={color} r="1" />
    </svg>
);

export default CircleIcon;
