import React from "react";
import { deleteSubscription, ISubscriptionRecord, subscribe } from "./helper";

export interface IAppProps {
  serviceWorker?: ServiceWorkerRegistration;
  subscriptionRecords: ISubscriptionRecord[];
  localSubsciptionRecord?: ISubscriptionRecord;
  webAPI: ComponentFramework.WebApi;
  refresh: () => void;
  openErrorDialog: (
    options: ComponentFramework.NavigationApi.ErrorDialogOptions
  ) => void;
}

export default class App extends React.Component<IAppProps> {
  public render() {
    return (
      <div>
        <p>{this.message}</p>
        {<this.localButton />}
        {this.hasSubscriptions ? <this.unsubscribeAllButton /> : null}
      </div>
    );
  }

  private get message() {
    const { subscriptionRecords, localSubsciptionRecord } = this.props;
    const plural = subscriptionRecords.length !== 1;

    // User has saved subscriptions, one of which is for this browser.
    if (this.hasSubscriptions && localSubsciptionRecord) {
      return `You have ${subscriptionRecords.length} active subscription${
        plural ? "s." : "."
      }`;
    }

    // User has saved subscriptions but none matching this browser.
    if (this.hasSubscriptions) {
      return `You have ${subscriptionRecords.length} active subscription${
        plural ? "s" : ""
      } but not in this browser.`;
    }

    // User has no subscriptions.
    return `You are not currently subscribed. Click below to get notified through this browser.`;
  }

  private get hasSubscriptions() {
    return this.props.subscriptionRecords.length > 0;
  }

  private get localButton() {
    const { serviceWorker, localSubsciptionRecord } = this.props;

    if (serviceWorker) {
      return localSubsciptionRecord
        ? this.unsubscribeButton
        : this.subscribeButton;
    }

    return this.disabledButton;
  }

  // Raw UI Elements
  private disabledButton = () => (
    <button disabled title="Web Push doesn't seem to be supported.">
      Subscribe this browser
    </button>
  );

  private subscribeButton = () => (
    <button onClick={this.catchError(this.subscribeOnClick)}>
      Subscribe this browser
    </button>
  );

  private unsubscribeButton = () => (
    <button onClick={this.catchError(this.unsubscribeOnClick)}>
      Unsubscribe this browser
    </button>
  );

  private unsubscribeAllButton = () => (
    <button onClick={this.catchError(this.unsubscribeAllOnClick)}>
      Unsubscribe everywhere
    </button>
  );

  // On Click Handlers 
  private subscribeOnClick = async () => {
    const { serviceWorker, webAPI } = this.props;
    await subscribe(serviceWorker!, webAPI);
    this.props.refresh();
  };
  
  private unsubscribeOnClick = async () => {
    const { localSubsciptionRecord, webAPI } = this.props;
    await deleteSubscription(localSubsciptionRecord!.id, webAPI);
    localSubsciptionRecord!.object.unsubscribe();
    this.props.refresh();
  };

  private unsubscribeAllOnClick = async () => {
    const { subscriptionRecords, webAPI } = this.props;
    await Promise.all(
      subscriptionRecords.map(record => deleteSubscription(record.id, webAPI))
    );
    this.props.refresh();
  };

  private catchError = (fn: () => Promise<void>) => () =>
    fn().catch(error =>
      this.props.openErrorDialog({
        message: "Unable to set up push notifications for this browser.",
        details: error.toString()
      })
    );
}
