import React from "react";
import { IViewProps } from "./ViewHelper";

// tslint:disable-next-line: function-name
export default function View(props: IViewProps) {
  // 1. Supported but no subscriptions
  // 2. Supported and subscriptions but not local
  // 3. Supported and subscriptions and local
  // 4. Not supported but with subscriptions
  // 5. Not supported and no subscriptions

  const s = props.subscriptions.length === 1 ? "" : "s";

  const currentSubscriptionsMessage =
    props.subscriptions.length === 0
      ? `You are not currently subscribed.`
      : `You have ${props.subscriptions.length} active subscription${s}.`;

  const subscribeMessage =
    props.localSubscription !== null
      ? "One of which is this browser. To stop recieving them here, click 'Unsubscribe' below."
      : props.serviceWorker == null
      ? `You can't subscribe this browser as it's not supported.`
      : `Click 'Subscribe' below to get notified through this browser.`;

  const localSubscriptionButton =
    props.serviceWorker == null ? (
      // Unsupported
      <button disabled>Subscribe</button>
    ) : props.localSubscription == null ? (
      // Supported and already subscribed
      <button onClick={props.subscribe}>Subscribe</button>
    ) : (
      // Supported and not yet subscribed
      <button onClick={props.unsubscribe}>Unsubscribe</button>
    );

  const allSubscriptionsButton =
    props.subscriptions.length > 0 ? (
      // Subscriptions exist
      <button onClick={props.unsubscribeAll}>Unsubscribe All</button>
    ) : null; // No subscriptions exist

  return (
    <>
      <p>
        {currentSubscriptionsMessage} {subscribeMessage}
      </p>
      {localSubscriptionButton}
      {allSubscriptionsButton}
    </>
  );
}
