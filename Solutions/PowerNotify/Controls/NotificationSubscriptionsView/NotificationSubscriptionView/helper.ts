import bowser from "bowser";
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface ISubscriptionRecord {
  id: string;
  object: PushSubscription;
}

export async function setupServiceWorker() {
  if (!(navigator.serviceWorker && "PushManager" in window)) {
    throw new Error("Service Workers and Push are not supported.");
  }

  const registrations = await navigator.serviceWorker.getRegistrations();

  if (registrations.length > 0) {
    return registrations[0];
  }

  const serviceWorkerURL = new URL(
    "WebResources/tda_service-worker.js",
    window.location.origin
  ).href;

  return await navigator.serviceWorker.register(serviceWorkerURL);
}

export async function subscribeToPushManaer(
  serviceWorker: ServiceWorkerRegistration,
  applicationServerKey: string
) {
  return serviceWorker.pushManager.subscribe({
    applicationServerKey,
    userVisibleOnly: true
  });
}

export async function saveSubscription(
  subscription: PushSubscription,
  webAPI: ComponentFramework.WebApi
) {
  return webAPI.createRecord("tda_webpushsubscription", {
    tda_friendlyname: createDeviceSubscriptionName(),
    tda_subscriptionobject: JSON.stringify(subscription)
  });
}

export async function deleteSubscription(
  id: string,
  webAPI: ComponentFramework.WebApi
) {
  return webAPI.deleteRecord("tda_webpushsubscription", id);
}

export async function subscribe(
  serviceWorker: ServiceWorkerRegistration,
  webAPI: ComponentFramework.WebApi
) {
  // Subscribe to push service
  const applicationServerKey = await getApplicationServerKey(webAPI);
  const subscription = await subscribeToPushManaer(
    serviceWorker,
    applicationServerKey
  );

  // Save subscription to CDS
  await saveSubscription(subscription, webAPI);
}

export async function getApplicationServerKey(
  webAPI: ComponentFramework.WebApi
) {
  const schemaName = "tda_WebPushPublicKey";
  const valueResult = await webAPI.retrieveMultipleRecords(
    "environmentvariablevalue",
    `?$filter=EnvironmentVariableDefinitionId/schemaname eq '${schemaName}' and statecode eq 0&$top=1`
  );

  if (valueResult.entities.length !== 1) {
    throw new Error("Application server key was unretrievable.");
  }

  return valueResult.entities[0].value as string;
}

export async function getLocalSubscription(
  serviceWorker: ServiceWorkerRegistration
) {
  return serviceWorker.pushManager.getSubscription();
}

export async function getLocalSubscriptionRecord(
  serviceWorker: ServiceWorkerRegistration,
  subscriptionRecords: ISubscriptionRecord[]
) {
  // Get Subscription from PushManager
  const localSubscription = await getLocalSubscription(serviceWorker);
  if (!localSubscription) return undefined;

  // Search for Subscription in records
  const record = subscriptionRecords.find(
    subscription => subscription.object.endpoint === localSubscription.endpoint
  );

  // Unsubscribe from local as it was not found in records
  if (!record) {
    await localSubscription.unsubscribe();
    return undefined;
  }

  return {
    id: record.id,
    object: localSubscription
  };
}

export async function getViewSubscriptions(subscriptions: DataSet) {
  const subscriptionRecords: ISubscriptionRecord[] = [];

  for (const id of subscriptions.sortedRecordIds) {
    const raw = subscriptions.records[id].getFormattedValue(
      "tda_SubscriptionObject"
    );
    
    const object = JSON.parse(raw) as PushSubscription;
    subscriptionRecords.push({ id, object });
  }

  return subscriptionRecords;
}

export function createDeviceSubscriptionName() {
  // Parse browser and OS details to build a name for the subscription if created.
  const browser = bowser.parse(window.navigator.userAgent);
  return `${browser.os.name} (${browser.os.versionName}) - ${browser.browser.name} (${browser.browser.version})`;
}
