# Usage
After configuring the solution, the on-going use is quite straight forward. The system creates "Messages" which have an associated "Event". Events are defined by you and can be as granular or broad as you'd like. Messages created will be developed by you in whatever means you'd like - they are just a custom Activity CDS record. A Flow defined in the solution will be triggered and then match the Owner of the record and the associated Event to a Subscription. If one exists, the Flow will check which methods have been selected and notifies the User accordingly. Simple.

Teams support has been added where another Flow will duplicate the Team owned Message record into individual User owned records. These are then processed normally. - LP What is meant by normally?

If a user doesn't want to be informed of a specific Event, they can unsubscribe. If a user deems a specific Event as urgent, they can enable Web Push and/or Mobile methods to bypass the flood of emails they might be receiving.

Please read more about the usage [here](How-to-use-Power-Notify).

What are the main use cases?
## Methods of delivery
In PowerNotify there are four methods of receiving notifications:
- Web
- Mobile
- Email
- Notification Tray
## Notification Tray
### <span style="color: #3b79b7">What is the Notification Tray?</span>

The Notification Tray is a core part of Power Notify. From here you can setup you event subscriptions and see all of your notifications.

It's always accessible through the fixed location in the top right hand corner.
![Notification Tray in banner](Assets/Notification%20Tray%20in%20banner.png)

To open, you simply click the icon.
![Blank Notification Tray](Assets/Blank%20Notification%20Tray.png)

The first time you access the Notification Tray, you will be prompted with the below dialog box, asking you if you would like to receive notifications via this browser. If you would like this option select 'Yes' otherwise select 'No'.
![Web Browser Subscription Prompt](Assets/Web%20Browser%20Subscription.png)

You can collapse the Notification Tray at any point by clicking '>' in the top right-hand corner.
![Collapse Notification Tray](Assets/Hide%20Notification%20Tray.png)

To re-open the Notification Tray for viewing when collapsed, click '<'.<br>
![Re-open Notification Tray](Assets/Re-open%20Notification%20Tray.png)

## Subscriptions
### <span style="color: #3b79b7">How do I create an event to be notified about?</span>

### <span style="color: #3b79b7">How to subscribe & unsubscribe from events?</span>
**Prior to being able to subscribe to any events, events must be created first. For more information on how to create events, please visit this [page](How-to-use-as-a-citizen-developer.md).**
1. Open the Notification Tray
2. Click 'Settings'
3. Click 'Manage Event Subscriptions'
4. Click 'Add Subscription'
![Add Subscription](Assets/Add%20Subscription.png)
### <span style="color: #3b79b7">How to manage my devices?</span>
**Starting from the home page of the Notification Tray**
1. Click 'Settings'
2. Click 'Manage Device Subscriptions'

Here you will see all devices to which you are subscribed to receive notifications

You can rename any device by 
1. simply clicking anywhere on the name of the Device Subscription Record
2. entering the new name
3. clicking anywhere on the screen away from the name

Before::

After::

If you no longer want a particular device to receive notifications, because maybe you don't own that device any longer, you can simply click the 'bin' icon associated with that Device Subscription record. After a few seconds you'll no longer see that device listed.
![Delete Device Subscription record](Assets/Delete%20Device%20Subscription.png)
### <span style="color: #3b79b7">How do I clear down my notification tray? Two ways dismiss individual or all in one go</span>
There are **two** methods to clear out notifications listed in the Notification Tray. 

#### Individual
Removing one by one gives you the complete control regarding what noficiations to keep or delete. 

#### All
Sometimes you just want to remove all notifications in one go because you've seen them all and they're no longer relevant.

1. On the bottom of the homepage within the Notification Tray, simply click 'Dismiss All'. *Poof*, just like magic, they're all gone!
### <span style="color: #3b79b7">How do I setup mobile for PowerNotify?</span>
1. Download the Power Apps mobile app from your phones app store
2. Launch the app
3. Sign into your organisation account

### <span style="color: #3b79b7">What you can do with a notification?</span>
