// (C) 2022 GoodData Corporation
import React from "react";

const GroupIcon: React.VFC<{ className: string, color?: string }> = ({ className, color }) => (
    <svg
        width="30"
        height="22"
        viewBox="0 2 30 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect stroke={color} x="6.5" y="1" width="15" height="11" rx="0.5" fill="white" />
        <rect stroke={color} x="3.5" y="4" width="15" height="11" rx="0.5" fill="white" />
        <rect stroke={color} x="0.5" y="7" width="15" height="11" rx="0.5" fill="white" />
    </svg>
);

export default GroupIcon;
