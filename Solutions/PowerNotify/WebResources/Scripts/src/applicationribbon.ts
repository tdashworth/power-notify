namespace PowerNotify.NotificationTray {
  export function onClick(executionContext: Xrm.Events.EventContext) {
    openNotificationTray();
    subscribeBrowser();
  }

  export function isDesktop() {
    return (
      Xrm.Utility.getGlobalContext().client.getFormFactor() ===
      XrmEnum.ClientFormFactor.Desktop
    );
  }

  export function setBadge() {
    async function setBadgeAsync() {
      const countOfMessages = await getMyMessagesCount()
      const styling = createBadgeStyling(countOfMessages > 100 ? 99 : countOfMessages)
      parent.document.getElementsByTagName('head')[0].appendChild(styling);
    }

    setBadgeAsync();
  }

  async function openNotificationTray() {
    try {
      const appId = await getNotificationTrayAppId();
      const url = `https://apps.powerapps.com/play/${appId}?&hidenavbar=true&embedded=true`;
      Xrm.Panel.loadPanel(url, "Notifications");
    } catch (error) {
      console.error(error);
    }
  }

  async function askToSubscribe() {
    const response = await Xrm.Navigation.openConfirmDialog({
      title: "Power Notify",
      subtitle: "If you change your mind, you can unsubscribe and configure what you get notified about in the notification tray settings.",
      text: "Would you like to recieve notifications via this browser?",
      confirmButtonLabel: "Yes",
      cancelButtonLabel: "No",
    });

    return response.confirmed;
  }

  async function subscribeBrowser() {
    try {
      // Get (and register) service worker
      const serviceWorker = await getAndRegisterServiceWorker();

      // Get or request local subscription
      const localSubscription = await getLocalSubscription(serviceWorker);
      const permissionDenied = await serviceWorker.pushManager
        .permissionState({ userVisibleOnly: true })
        .then(result => result === "denied");
      if (!localSubscription && !permissionDenied && askToSubscribe()) {
        await requestLocalSubscription(serviceWorker);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getNotificationTrayAppId() {
    log("Getting Notification Tray App Id...");
    const canvasAppSchemaName = "tda_notificationtray_776a0";
    const result = await Xrm.WebApi.online
      .retrieveMultipleRecords(
        `canvasapp`,
        `?$filter=name eq '${canvasAppSchemaName}'&$select=canvasappid&$top=1`
      )
      .then(
        result =>
          result.entities[0] && (result.entities[0].canvasappid as string)
      );

    if (!result) {
      throw new Error("App Id was unretrievable.");
    }

    log("Retrieved Notification Tray App Id: ", result);
    return result;
  }

  async function getApplicationServerKey() {
    log("Getting Application Server Key...");
    const environmentVariableSchemaName = "tda_WebPushPublicKey";
    let result = await Xrm.WebApi.online
      .retrieveMultipleRecords(
        "environmentvariablevalue",
        `?$filter=EnvironmentVariableDefinitionId/schemaname eq '${environmentVariableSchemaName}' and statecode eq 0&$top=1`
      )
      .then(result => result.entities[0] && result.entities[0].value);

    if (!result) {
      log("No set value for Application Server Key. Getting default value...");
      result = await Xrm.WebApi.online
        .retrieveMultipleRecords(
          "environmentvariabledefinition",
          `?$filter=schemaname eq '${environmentVariableSchemaName}' and statecode eq 0&$top=1`
        )
        .then(result => result.entities[0] && result.entities[0].defaultvalue);
    }

    if (!result) {
      throw new Error("Application Server Key was unretrievable.");
    }

    log("Retrieved Application Server Key: ", result);
    return result;
  }

  async function getAndRegisterServiceWorker() {
    log("Getting domain's Service Worker...");
    if (!(navigator.serviceWorker && "PushManager" in window)) {
      throw new Error("Service Workers and Push are not supported.");
    }

    // Get current registation if it exists.
    let registration = await navigator.serviceWorker
      .getRegistrations()
      .then(registrations => registrations[0] || null);

    // Register if none found
    if (!registration) {
      log("No Service Worker registration found. Registering now...");

      const serviceWorkerURL = new URL(
        "WebResources/tda_service-worker.js",
        window.location.origin
      ).href;

      registration = await navigator.serviceWorker.register(serviceWorkerURL);
    }

    log("Retrieved Service Worker: ", registration.scope);
    return registration;
  }

  async function getLocalSubscription(
    serviceWorker: ServiceWorkerRegistration
  ) {
    log("Getting Local Subscription...");
    const localSubscription = await serviceWorker.pushManager.getSubscription();
    if (!localSubscription) {
      log("Local Subscription doesn't exist.");
      return null;
    }

    log("Retrieved Local Subscription.");
    return localSubscription;
  }

  async function requestLocalSubscription(
    serviceWorker: ServiceWorkerRegistration
  ) {
    log("Requesting Local Subscription...");
    const localSubscription = await serviceWorker.pushManager.subscribe({
      applicationServerKey: await getApplicationServerKey(),
      userVisibleOnly: true
    });

    log("User approved Subscription. Saving...");

    Xrm.WebApi.online.createRecord("tda_webpushsubscription", {
      tda_friendlyname: createDeviceSubscriptionName(),
      tda_subscriptionobject: JSON.stringify(localSubscription)
    });
    log("Saved Local Subscription.");
    return localSubscription;
  }

  function createDeviceSubscriptionName() {
    const browsers = [
      { regex: /MZBrowser/i, name: "MZ Browser" },
      { regex: /focus/i, name: "Focus" },
      { regex: /swing/i, name: "Swing" },
      { regex: /coast/i, name: "Opera Coast" },
      { regex: /yabrowser/i, name: "Yandex Browser" },
      { regex: /ucbrowser/i, name: "UC Browser" },
      { regex: /Maxthon|mxios/i, name: "Maxthon" },
      { regex: /epiphany/i, name: "Epiphany" },
      { regex: /puffin/i, name: "Puffin" },
      { regex: /sleipnir/i, name: "Sleipnir" },
      { regex: /k-meleon/i, name: "K-Meleon" },
      { regex: /micromessenger/i, name: "WeChat" },
      { regex: /qqbrowser/i, name: "QQ Browser" },
      { regex: /msie|trident/i, name: "Internet Explorer" },
      { regex: /\sedg\//i, name: "Microsoft Edge" },
      { regex: /edg([ea]|ios)/i, name: "Microsoft Edge" },
      { regex: /vivaldi/i, name: "Vivaldi" },
      { regex: /seamonkey/i, name: "SeaMonkey" },
      { regex: /sailfish/i, name: "Sailfish" },
      { regex: /silk/i, name: "Amazon Silk" },
      { regex: /phantom/i, name: "PhantomJS" },
      { regex: /slimerjs/i, name: "SlimerJS" },
      { regex: /blackberry|\bbb\d+/i, name: "BlackBerry" },
      { regex: /(web|hpw)[o0]s/i, name: "WebOS Browser" },
      { regex: /bada/i, name: "Bada" },
      { regex: /tizen/i, name: "Tizen" },
      { regex: /qupzilla/i, name: "QupZilla" },
      { regex: /firefox|iceweasel|fxios/i, name: "Firefox" },
      { regex: /electron/i, name: "Electron" },
      { regex: /chromium/i, name: "Chromium" },
      { regex: /chrome|crios|crmo/i, name: "Chrome" },
      { regex: /GSA/i, name: "Google Search" },
      { regex: /android/i, name: "Android Browser" },
      { regex: /playstation 4/i, name: "PlayStation 4" },
      { regex: /safari|applewebkit/i, name: "Safari" }
    ];
    const oss = [
      { regex: /Roku\/DVP/, name: "Roku" },
      { regex: /windows phone/i, name: "Windows Phone" },
      { regex: /windows /i, name: "Windows" },
      { regex: /Macintosh(.*?) FxiOS(.*?) Version\//, name: "iOS" },
      { regex: /macintosh/i, name: "macOS" },
      { regex: /(ipod|iphone|ipad)/i, name: "iOS" },
      { regex: undefined, name: "Android" },
      { regex: /(web|hpw)[o0]s/i, name: "WebOS" },
      { regex: /blackberry|\bbb\d+/i, name: "BlackBerry" },
      { regex: /bada/i, name: "Bada" },
      { regex: /tizen/i, name: "Tizen" },
      { regex: /linux/i, name: "Linux" },
      { regex: /CrOS/, name: "Chrome OS" },
      { regex: /PlayStation 4/, name: "PlayStation 4" }
    ];

    const userAgent = window.navigator.userAgent;

    const browser = find(browsers, ({ regex }) => regex.test(userAgent)).name;
    const os = find(oss, ({ regex }) => regex.test(userAgent)).name;

    return `${browser} (${os})`;
  }

  function createBadgeStyling(content) {
    const styling = document.createElement('style');
    styling.type = 'text/css';
    styling.id = 'tda_PowerNotify.ApplicationRibbon'
    styling.innerHTML = `
    button[data-id="tda.ApplicationRibbon.NotificationTray.Button"] {
      position: relative;
    }

    button[data-id="tda.ApplicationRibbon.NotificationTray.Button"] > span::after {
      content: '${content}';
      position: absolute;
      box-sizing: border-box;
      height: 1.5rem;
      min-width: 1.5rem;
      line-height: 1.5rem;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
      right: 5px;
      bottom: 5px;
      border-radius: 100rem;
      text-align: center;
      font-size: x-small;
      font-weight: bold;
      color: white;
      background-color: red;
    }
    `;
    return styling;
  }

  async function getMyMessagesCount() {
    const { userId } = Xrm.Utility.getGlobalContext().userSettings;
    const result = await Xrm.WebApi.online
      .retrieveMultipleRecords(
        "tda_notificationmessage",
        `?$count=true&$filter=_ownerid_value eq ${userId}`
      )
      .then(result => result.entities.length)

    return result
  }

  function find<T>(arr: T[], predicate: (T, int?) => boolean): T {
    for (let i = 0, l = arr.length; i < l; i += 1) {
      const value = arr[i];
      if (predicate(value, i)) {
        return value;
      }
    }
    return undefined;
  }

  function log(...messgae) {
    console.log("Power Notify - ", ...messgae);
  }
}
