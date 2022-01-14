// (C) 2021 GoodData Corporation
import "core-js/stable";
import "regenerator-runtime/runtime";
import "@gooddata/sdk-ui-ext/styles/css/main.css";
import "~css/fonts/fonts.scss";
import "~css/reset.scss";

import { render } from "react-dom";

import App from "~components/app";

const renderApp = (TheApp) => {
    render(<TheApp />, document.getElementById("root"));
};

if (module.hot) {
    module.hot.accept("./components/app", () => {
        const app = require("./components/app").default; // eslint-disable-line @typescript-eslint/no-var-requires
        renderApp(app);
    });
}

renderApp(App);
