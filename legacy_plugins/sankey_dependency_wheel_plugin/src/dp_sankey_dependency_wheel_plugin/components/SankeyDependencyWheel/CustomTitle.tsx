import React, { FC, PropsWithChildren } from "react";

export const CustomTitle: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="item-headline-outer">
            <div className="item-headline">
                <div className="item-headline-inner s-headline">{children}</div>
            </div>
        </div>
    );
};
