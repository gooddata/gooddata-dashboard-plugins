// (C) 2023-2024 GoodData Corporation

import { Component, ErrorInfo, ReactNode } from "react";

interface IErrorBoundaryProps {
    children: ReactNode;
    ErrorComponent: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<IErrorBoundaryProps, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_e: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.ErrorComponent;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
