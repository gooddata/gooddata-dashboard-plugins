// (C) 2019 GoodData Corporation
declare module "*.svg" {
    const content: any;
    export default content;
}
declare module "*.png" {
    const value: any;
    export default value;
}
declare module "*.scss" {
    const content: { [className: string]: string };
    export = content;
}

declare const BACKEND_URL: string; // Actual backend url

declare module "react-leaflet-markercluster" {
    import { Component } from "react";
    export default class MarkerClusterGroup extends Component<MarkerClusterGroupProps> {}
}
