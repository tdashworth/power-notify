import { IInputs } from "./generated/ManifestTypes";

export interface IViewProps {
  serviceWorker: ServiceWorkerRegistration | undefined;
  subscriptions: PushSubscriptionJSON[];
  localSubscription: PushSubscription | undefined;
  subscribe: () => void;
  unsubscribe: () => void;
  unsubscribeAll: () => void;
  update: (context: ComponentFramework.Context<IInputs>) => void;
}

export default class ViewHelper implements IViewProps {
  public serviceWorker: ServiceWorkerRegistration | undefined;
  public subscriptions: PushSubscriptionJSON[];
  public localSubscription: PushSubscription | undefined;
  public subscribe: () => void = this.onClickSubscribe.bind(this);
  public unsubscribe: () => void = this.onClickUnsubscribe.bind(this);
  public unsubscribeAll: () => void = this.onClickUnsubscribeAll.bind(this);

  private notifyOutputChanged: () => void;
  private controlContext: ComponentFramework.Context<IInputs>;

  public constructor(notifyOutputChanged: () => void) {
    this.notifyOutputChanged = notifyOutputChanged;
  }

  public async update(controlContext: ComponentFramework.Context<IInputs>) {
    this.controlContext = controlContext;

    this.subscriptions = this.parseSubscriptions(
      this.controlContext.parameters.subscriptions.raw
    );

    this.serviceWorker =
      this.serviceWorker || (await this.getOrSetupServiceWorker());

    this.localSubscription =
      this.localSubscription || (await this.getLocalSubscription());
  }

  public parseSubscriptions(raw: string | null): PushSubscriptionJSON[] {
    if (!raw) return [];
    if (raw[0] !== "[" || raw[raw.length - 1] !== "]") return [];
    return JSON.parse(raw);
  }

  private removeItemFromArray<T>(
    array: T[],
    itemToRemove: T,
    comparer: (item1: T, item2: T) => boolean
  ) {
    return array.reduce((result, currentItem) => {
      if (!comparer(currentItem, itemToRemove)) {
        result.push(currentItem);
      }

      return result;
    }, [] as T[]);
  }

  private async getOrSetupServiceWorker() {
    try {
      if (!(navigator.serviceWorker && "PushManager" in window)) {
        throw new Error("Service Workers and Push are not supported.");
      }

      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) return registrations[0];

      const serviceWorkerURL = new URL(
        "WebResources/tda_service-worker.js",
        window.location.origin
      ).href;

      return await navigator.serviceWorker.register(serviceWorkerURL);
    } catch (err) {
      return;
    }
  }

  private async getLocalSubscription() {
    try {
      if (!this.serviceWorker) throw new Error("Not supported.");

      const localSubscription = await this.serviceWorker.pushManager.getSubscription();
      if (localSubscription == null) return;

      // If the subscription isn't stored at this time, the user must of unsubscribed all on a different browser.
      const subscriptionStored = this.subscriptions.some(
        subscription => subscription.endpoint === localSubscription.endpoint
      );
      if (!subscriptionStored) {
        localSubscription.unsubscribe();
        return;
      }

      return localSubscription;
    } catch (err) {
      return;
    }
  }

  private async getApplicationServerKey() {
    if (this.controlContext.userSettings.userName === "") {
      return "BJblRtV--t2qM1-YujmdApByAGvkQKEGJCxE8ZKYqy1cBqm_ySlh5w2ntkQY6fiTyZT51umEvZo0xitDWTXA9UY";
    }

    const schemaName = "tda_WebPushPublicKey";
    const valueResult = await this.controlContext.webAPI.retrieveMultipleRecords(
      "environmentvariablevalue",
      `?$filter=EnvironmentVariableDefinitionId/schemaname eq '${schemaName}' and statecode eq 0&$top=1`
    );

    if (valueResult.entities.length !== 1) {
      throw new Error("Application server key was unretrievable.");
    }

    return valueResult.entities[0].value as string;
  }

  private async onClickSubscribe() {
    try {
      if (!this.serviceWorker) throw new Error("Not supported.");

      const subscription = await this.serviceWorker.pushManager.subscribe({
        applicationServerKey: await this.getApplicationServerKey(),
        userVisibleOnly: true
      });

      this.localSubscription = subscription;
      this.subscriptions.push(subscription.toJSON());

      this.notifyOutputChanged();
    } catch (err) {
      this.controlContext.navigation.openErrorDialog({
        message:
          "Whoops, that failed. Try again or talk to your system administrator.",
        details: this.stringifyError(err)
      });
    }
  }

  private async onClickUnsubscribe() {
    try {
      if (!this.localSubscription) throw new Error("No local subscription.");

      this.subscriptions = this.removeItemFromArray(
        this.subscriptions,
        this.localSubscription,
        (item1, item2) => item1.endpoint === item2.endpoint
      );

      await this.localSubscription.unsubscribe();
      this.localSubscription = undefined;

      this.notifyOutputChanged();
    } catch (err) {
      this.controlContext.navigation.openErrorDialog({
        message:
          "Whoops, that failed. Try again or talk to your system administrator.",
        details: this.stringifyError(err)
      });
    }
  }

  private async onClickUnsubscribeAll() {
    try {
      // Unsubscribe locally if there is a subscriptions.
      if (this.localSubscription) {
        await this.localSubscription.unsubscribe();
        this.localSubscription = undefined;
      }

      // Clear all the subscriptions.
      this.subscriptions = [];
      this.notifyOutputChanged();
    } catch (err) {
      this.controlContext.navigation.openErrorDialog({
        message:
          "Whoops, that failed. Try again or talk to your system administrator.",
        details: this.stringifyError(err)
      });
    }
  }

  private stringifyError(err: any): string {
    return `${err.message}\n\n${err.stack}`;
  }
}
