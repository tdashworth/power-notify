This guide will explain the steps required to get Power Notify working in your PowerApps environment. 

# Forwarding Server
Firstly, if you wish to use the Web Push (browser notification) delivery method, a forwarding server is required that would encrypt and send the notification. This is achieved with an Azure Functions which handles this computation but this is a small amount of NodeJS code which could be hosted anywhere accessible for the Flow to call. The code for this can be found [here](https://dev.azure.com/tdashworth/Power%20Notify/_git/power-notify?path=%2FAzure). 

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Ftdashworth%2FPowerNotify%2Fmaster%2Fsrc%2Fazure%2Fazure-deploy.json)

It's worth noting that the server is **very** generic and is not tied to an environment which means it can be used for multiple such as dev, CI/CD, and test. The server requires a set of keys, public and private, which are used for the encryption and an optional subject (primary contact email)[see section 2.1 [here](https://datatracker.ietf.org/doc/rfc8292/?include_text=1)]. The keys need to first be generated which can be done using [https://vapidkeys.com/](https://vapidkeys.com/).

The public key also needs to be retained within the PowerPlatform for the user to access enabling them to decrypt the notification upon delivery. Please save that value in the environment variable called `Web Push Public Key` during the solution installation.

The Flow that triggers this process is bound to a custom connector which defines the routes available on the webserver. Once your server is running, update the custom connector (under PowerApps Maker Portal > Data > Custom Connectors > Web Push Forwarding Server) with your server's details (URL and authentication) and save the connector. 

# Solution Install 
After downloading a copy of the [managed solution](), it needs to be installed into your environment. This can be done several ways including manually or the Solution Deployer.

If importing manually, the following screen will show asking to enter the variable values. You will see a warning in the maker portal once the import is complete if you don't enter these values now.

![Solution Import - Environment Variables](Assets/Solution%20Import%20Variables.png)

For `Web Push Public Key`, use the value generated while setting up the Forwarding Server. For `Default App Id`, enter the App Id of the Model-Driven App your users will use by default - it will be used by a Flow the generate a link for the Notification Message upon clicking it. This can be left blank and users can set their own value within the Notification Tray. 

# Additional Configuration
**Next, and importantly, you need to activate the Flows in the solution.** These aren't activated on install because it requires some connections to be set up. Open the PowerNotify solution and for each Flow: 
1) Open the editor for the Flow.
2) You should be greeted with a dialogue asking for four connections.
   - CDS Current Environment - this is a premium connector so make sure as the logged-on user you have a licence
   - Web Push Forwarding Server - this is what you previously configured and now need to create a connection with authentication
   - Mail - out-of-the-box PowerApp mail sender
   - PowerApps Notification - used to send the mobile notification. The solution contains an app called "Notification Tray" which should be the app id provided.
3) **Save!**
4) Go back to the details screen and activate if not already done so. 


All these configurations can be added to your own unmanaged solution if you'd like them to migrate with your solution. I'd recommend the `Default App Id` is not included in that at all as it will always be different. The other environment variables and custom connector could be added but I'd imagine they would change for production so manually configuring for each environment is recommended.


# Test
You are now configured and can test your set up.
1) Create an Event record (right now a temporary one will do) by navigating to [environment base url]/main.aspx?forceUCI=1&pagetype=entityrecord&etn=tda_notificationchannel
2) Click in the bell icon within the application ribbon (top-right of the screen) 
3) Create a new Notification Subscription selecting your newly created Event and all the methods. [Visit usage guide](./How-to-use-as-an-end-user.md#how-to-subscribe--unsubscribe-from-events)
4) Create a new Notification Message Activity setting the Owner to yourself and the Event to the one you are subscribed to. Add a subject, description, and regarding record then save. [environment base url]/main.aspx?forceUCI=1&pagetype=entityrecord&etn=tda_notificationmessage
5) Just wait... you should:
   - receive an email to your primary email address
   - receive a web push notification from your browser
   - be able to view the Message in the Notification Tray in the browser via the notification symbol in the top ribbon and on the mobile PowerApps app if you open the specific PowerApp.
   - not receive a mobile push notification **unless** you have previously opened the Notification Tray app in the mobile PowerApp app. 

If something does fail here unexpectedly, have a look the Flow within the Power Notify solution for any failures.

# Events Data

Event records are nothing more than streams for which users subscribe to. With only a name, these could be created manually (even for other environments). My recommendation would be to source control these records (at least those referenced within your own solutions) and import them into each environment through automation. This method also allows you to use the records' unique indentifiers, knowning they'll exist in each environment. 

I would also recommend access is managed under security role to limit who in the organisation can create, update, and view these records. 

To create a record, if it hasn't been added to an app which you have access to, navigate to: [environment base url]/main.aspx?forceUCI=1&pagetype=entityrecord&etn=tda_notificationchannel
