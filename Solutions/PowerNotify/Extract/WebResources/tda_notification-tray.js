var NotificationTray = {
  open: async function(ec) {
    const appId = await NotificationTray.getAppId(Xrm.WebApi.online)
    var url =
      `https://apps.powerapps.com/play/${appId}?&hidenavbar=true&embedded=true`;
    Xrm.Panel.loadPanel(url, "Notifications");
  },

  isDesktop: function() {
    return Xrm.Utility.getGlobalContext().client.getFormFactor() == 1;
  },

  getAppId: async function(webAPI) {
    const schemaName = 'tda_notificationtray_776a0';
    const valueResult = await webAPI.retrieveMultipleRecords(
      `canvasapp`,
      `?$filter=name eq '${schemaName}'&$select=canvasappid`
    );

    if (valueResult.entities.length !== 1) {
      throw new Error("App Id was unretrievable.");
    }

    return valueResult.entities[0].canvasappid;
  }
};
