// (C) 2024 GoodData Corporation

import React from "react";

export const CustomTitle: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className="item-headline-outer">
            <div className="item-headline">
                <div className="item-headline-inner s-headline">{children}</div>
            </div>
        </div>
    );
};
