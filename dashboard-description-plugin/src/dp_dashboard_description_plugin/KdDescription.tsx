import React from 'react';
import {
    IDashboardWidgetProps
} from "@gooddata/sdk-ui-dashboard";

type PluginData = {
    description: string[],
};

type PluginDataLoadingState = null | 'loading' | 'loaded' | 'error';

// @ts-ignore
export function KdDescription({widget: {configUrl}}: IDashboardWidgetProps): JSX.Element {
    const [data, setData] = React.useState<PluginData | null>(null);
    const [loadingState, setLoadingState] = React.useState<PluginDataLoadingState>(null);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    React.useEffect(() => {
        setLoadingState('loading');
        fetch(configUrl)
            .then(res => res.json())
            .then(data => {
                setLoadingState('loaded');
                setData(data);
            })
            .catch(error => {
                setLoadingState('error');
                setErrorMessage(error.message);
            });

        return () => {};
    }, []);

    if (loadingState === 'error') {
        return <div style={styles.error}>{errorMessage}</div>
    }

    if (loadingState === 'loading') {
        return <div style={styles.wrap}>Loading...</div>;
    }

    return <div style={styles.wrap}>
        {data?.description.map((paragraph, i) => {
            return <p key={i} style={styles.paragraph}>{paragraph}</p>;
        })}
    </div>;
}

const styles: {[key: string]: React.CSSProperties} = {
    wrap: {
        padding: '0 1em',
        columnCount: 2,
    },
    paragraph: {
        marginTop: 0,
        marginBottom: '1em',
    },
    error: {
        padding: '0 1em',
        color: 'red',
    },
};
