// (C) 2021 GoodData Corporation
import { useEffect } from "react";

// TODO: Type this func
export const useOutsideClickHandler = ({ ref, onOutsideClick }) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onOutsideClick]);
};
