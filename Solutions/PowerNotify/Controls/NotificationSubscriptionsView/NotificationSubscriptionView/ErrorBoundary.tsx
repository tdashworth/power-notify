import React from "react";

export default class ErrorBoundary extends React.Component<
  any,
  { hasError: boolean }
> {

  public static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    debugger;
    console.log(error);
    console.log(errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
