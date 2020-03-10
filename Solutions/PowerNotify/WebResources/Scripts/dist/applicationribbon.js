var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var PowerNotify;
(function (PowerNotify) {
    var NotificationTray;
    (function (NotificationTray) {
        function onClick(executionContext) {
            openNotificationTray();
            subscribeBrowser();
        }
        NotificationTray.onClick = onClick;
        function isDesktop() {
            return (Xrm.Utility.getGlobalContext().client.getFormFactor() ===
                2 /* Desktop */);
        }
        NotificationTray.isDesktop = isDesktop;
        function openNotificationTray() {
            return __awaiter(this, void 0, void 0, function () {
                var appId, url, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, getNotificationTrayAppId()];
                        case 1:
                            appId = _a.sent();
                            url = "https://apps.powerapps.com/play/" + appId + "?&hidenavbar=true&embedded=true";
                            Xrm.Panel.loadPanel(url, "Notifications");
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        function subscribeBrowser() {
            return __awaiter(this, void 0, void 0, function () {
                var serviceWorker, localSubscription, permissionDenied, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, getAndRegisterServiceWorker()];
                        case 1:
                            serviceWorker = _a.sent();
                            return [4 /*yield*/, getLocalSubscription(serviceWorker)];
                        case 2:
                            localSubscription = _a.sent();
                            return [4 /*yield*/, serviceWorker.pushManager
                                    .permissionState({ userVisibleOnly: true })
                                    .then(function (result) { return result === "denied"; })];
                        case 3:
                            permissionDenied = _a.sent();
                            if (!(!localSubscription && !permissionDenied)) return [3 /*break*/, 5];
                            return [4 /*yield*/, requestLocalSubscription(serviceWorker)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_2 = _a.sent();
                            console.error(error_2);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        function getNotificationTrayAppId() {
            return __awaiter(this, void 0, void 0, function () {
                var canvasAppSchemaName, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log("Getting Notification Tray App Id...");
                            canvasAppSchemaName = "tda_notificationtray_776a0";
                            return [4 /*yield*/, Xrm.WebApi.online
                                    .retrieveMultipleRecords("canvasapp", "?$filter=name eq '" + canvasAppSchemaName + "'&$select=canvasappid&$top=1")
                                    .then(function (result) {
                                    return result.entities[0] && result.entities[0].canvasappid;
                                })];
                        case 1:
                            result = _a.sent();
                            if (!result) {
                                throw new Error("App Id was unretrievable.");
                            }
                            log("Retrieved Notification Tray App Id: ", result);
                            return [2 /*return*/, result];
                    }
                });
            });
        }
        function getApplicationServerKey() {
            return __awaiter(this, void 0, void 0, function () {
                var environmentVariableSchemaName, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log("Getting Application Server Key...");
                            environmentVariableSchemaName = "tda_WebPushPublicKey";
                            return [4 /*yield*/, Xrm.WebApi.online
                                    .retrieveMultipleRecords("environmentvariablevalue", "?$filter=EnvironmentVariableDefinitionId/schemaname eq '" + environmentVariableSchemaName + "' and statecode eq 0&$top=1")
                                    .then(function (result) { return result.entities[0] && result.entities[0].value; })];
                        case 1:
                            result = _a.sent();
                            if (!!result) return [3 /*break*/, 3];
                            log("No set value for Application Server Key. Getting default value...");
                            return [4 /*yield*/, Xrm.WebApi.online
                                    .retrieveMultipleRecords("environmentvariabledefinition", "?$filter=schemaname eq '" + environmentVariableSchemaName + "' and statecode eq 0&$top=1")
                                    .then(function (result) { return result.entities[0] && result.entities[0].defaultvalue; })];
                        case 2:
                            result = _a.sent();
                            _a.label = 3;
                        case 3:
                            if (!result) {
                                throw new Error("Application Server Key was unretrievable.");
                            }
                            log("Retrieved Application Server Key: ", result);
                            return [2 /*return*/, result];
                    }
                });
            });
        }
        function getAndRegisterServiceWorker() {
            return __awaiter(this, void 0, void 0, function () {
                var registration, serviceWorkerURL;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log("Getting domain's Service Worker...");
                            if (!(navigator.serviceWorker && "PushManager" in window)) {
                                throw new Error("Service Workers and Push are not supported.");
                            }
                            return [4 /*yield*/, navigator.serviceWorker
                                    .getRegistrations()
                                    .then(function (registrations) { return registrations[0] || null; })];
                        case 1:
                            registration = _a.sent();
                            if (!!registration) return [3 /*break*/, 3];
                            log("No Service Worker registration found. Registering now...");
                            serviceWorkerURL = new URL("WebResources/tda_service-worker.js", window.location.origin).href;
                            return [4 /*yield*/, navigator.serviceWorker.register(serviceWorkerURL)];
                        case 2:
                            registration = _a.sent();
                            _a.label = 3;
                        case 3:
                            log("Retrieved Service Worker: ", registration.scope);
                            return [2 /*return*/, registration];
                    }
                });
            });
        }
        function getLocalSubscription(serviceWorker) {
            return __awaiter(this, void 0, void 0, function () {
                var localSubscription;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            log("Getting Local Subscription...");
                            return [4 /*yield*/, serviceWorker.pushManager.getSubscription()];
                        case 1:
                            localSubscription = _a.sent();
                            if (!localSubscription) {
                                log("Local Subscription doesn't exist.");
                                return [2 /*return*/, null];
                            }
                            log("Retrieved Local Subscription.");
                            return [2 /*return*/, localSubscription];
                    }
                });
            });
        }
        function requestLocalSubscription(serviceWorker) {
            return __awaiter(this, void 0, void 0, function () {
                var localSubscription, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            log("Requesting Local Subscription...");
                            _b = (_a = serviceWorker.pushManager).subscribe;
                            _c = {};
                            return [4 /*yield*/, getApplicationServerKey()];
                        case 1: return [4 /*yield*/, _b.apply(_a, [(_c.applicationServerKey = _d.sent(),
                                    _c.userVisibleOnly = true,
                                    _c)])];
                        case 2:
                            localSubscription = _d.sent();
                            log("User approved Subscription. Saving...");
                            Xrm.WebApi.online.createRecord("tda_webpushsubscription", {
                                tda_friendlyname: createDeviceSubscriptionName(),
                                tda_subscriptionobject: JSON.stringify(localSubscription)
                            });
                            log("Saved Local Subscription.");
                            return [2 /*return*/, localSubscription];
                    }
                });
            });
        }
        function createDeviceSubscriptionName() {
            var browsers = [
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
            var oss = [
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
            var userAgent = window.navigator.userAgent;
            var browser = find(browsers, function (_a) {
                var regex = _a.regex;
                return regex.test(userAgent);
            }).name;
            var os = find(oss, function (_a) {
                var regex = _a.regex;
                return regex.test(userAgent);
            }).name;
            return browser + " (" + os + ")";
        }
        function find(arr, predicate) {
            for (var i = 0, l = arr.length; i < l; i += 1) {
                var value = arr[i];
                if (predicate(value, i)) {
                    return value;
                }
            }
            return undefined;
        }
        function log() {
            var messgae = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messgae[_i] = arguments[_i];
            }
            console.log.apply(console, __spreadArrays(["Power Notify - "], messgae));
        }
    })(NotificationTray = PowerNotify.NotificationTray || (PowerNotify.NotificationTray = {}));
})(PowerNotify || (PowerNotify = {}));
//# sourceMappingURL=applicationribbon.js.map