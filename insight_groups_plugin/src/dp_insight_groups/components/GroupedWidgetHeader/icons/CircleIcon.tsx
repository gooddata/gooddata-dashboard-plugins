// (C) 2024 GoodData Corporation
import React from "react";

const CircleIcon: React.FC<{ width: number; height: number; color: string }> = ({ width, height, color }) => (
    <svg width={width} height={height} viewBox="-1 -1 2 2" fill={color} xmlns="http://www.w3.org/2000/svg">
        <circle r="1" />
    </svg>
);

export default CircleIcon;
