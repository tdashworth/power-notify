import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as webPush from "web-push"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        // Get and validate web-push config
        const { vapidSubject, vapidPublicKey, vapidPrivateKey } = process.env;
        if (!vapidPublicKey || !vapidPrivateKey) throw new Error("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.");

        // Web Push setup
        webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

        // Get and validate request body
        const data = req.body as { subscription: webPush.PushSubscription, payload: any };
        if (!data || !data.subscription || !data.payload) throw new Error("The body must contain a subscription and payload properties.");

        // Send notification
        const result = await webPush.sendNotification(data.subscription, JSON.stringify(data.payload));
        context.res = {
            status: result.statusCode,
            headers: result.headers,
            body: result.body,
        };

    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: error.message
        };
    }
};

export default httpTrigger;
