import React from "react";
import ReactDom from "react-dom";
import App, { IAppProps } from "./App";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import {
  getLocalSubscriptionRecord,
  getViewSubscriptions,
  setupServiceWorker
} from "./helper";

export class NotificationSubscriptionView
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private container: HTMLDivElement;
  private serviceWorker?: ServiceWorkerRegistration;

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {    
    this.container = document.createElement('div');
    container.append(this.container);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public async updateView(context: ComponentFramework.Context<IInputs>) {
    // Get/setup service worker if not already done so.
    const serviceWorker =
      this.serviceWorker ||
      (await setupServiceWorker().catch(e => {
        context.navigation.openErrorDialog({
          message: "Unable to set up push notifications for this browser.",
          details: e.toString()
        });
        return undefined;
      }));
    this.serviceWorker = serviceWorker;

    // Read and parse records from the view
    const subscriptionRecords = await getViewSubscriptions(
      context.parameters.notificationSubscriptions
    );

    // Pick out the local subsciption if it exists
    const localSubsciptionRecord = serviceWorker
      ? await getLocalSubscriptionRecord(serviceWorker, subscriptionRecords)
      : undefined;

    const props: IAppProps = {
      serviceWorker,
      subscriptionRecords,
      localSubsciptionRecord,
      refresh: context.parameters.notificationSubscriptions.refresh,
      webAPI: context.webAPI,
      openErrorDialog: context.navigation.openErrorDialog
    };
    ReactDom.render(React.createElement(App, props), this.container);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
