# GoodData Dashboard Plugins

You can find a number of Dashboard Plugins in this repository. Each folder contains a separate plugin.

-   [Gauge chart](./gauge_chart_plugin) - replace a bullet chart with a Gauge chart by tag.
-   [Dashboard description](./dashboard_description_plugin) - add a reach text description to the dashboard.
-   [Insight groups](./insight_groups_plugin) - can group more insights.
-   [Radial bar chart](./radial_bar_chart_plugin) - replace column charts with [Recharts](https://recharts.org/) radial bar charts.
-   [Polar area chart](./polar_area_chart_plugin) - replace donut (or pie) charts with [Chart.js](https://www.chartjs.org/) polar area charts.

## Legacy Plugins

You can find plugins that may no longer be actively used due to their functionality being incorporated into the GoodData product (or other reasons) in [legacy plugins](./legacy_plugins) folder. They can still serve as valuable starting points for creating similar plugins.

-   [Single select attribute filter](./legacy_plugins/single_select_plugin) - render specified attribute filters as a single select attribute filters.
-   [Tooltip](./legacy_plugins/tooltip_plugin) - add a tooltip to the insight.
-   [Sankey dependency wheel](./legacy_plugins/sankey_dependency_wheel_plugin) - replace tables with one metric and two attributes with [Highcharts](https://www.highcharts.com/) sankey dependency wheels.
-   [Insight to action](./legacy_plugins/insight_to_action) - pivot table with button for API calls

# FAQ

## Can I use the plugin for my dashboard in production?

This repository is primarily meant to be used as a starting point for you to develop your own plugins or to see what
plugins are capable of in general. You should be able to use these plugins in production, but before doing so,
make sure to read the plugin's README.md file. You might want to run it by your security team to ensure the
plugin you've chosen adhere to your company's security requirements.

Please see the [LICENSE](./LICENSE) for the license of the code in this repository and [NOTICE](./NOTICE) for the licenses and attributions of the dependencies.
