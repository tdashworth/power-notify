This guide will explain the steps required to get Power Notify working in your PowerApps environment. 

# Solution Install 
After downloading a copy of the [managed solution](), it needs to be installed into your environment. This can be done several ways including manually and via the Solution Deployer.

You will see a warning in the maker portal once complete regarding environment variables - this is expected but for now can be left until some further set up is complete. 


# Forwarding Server
Unfortunately, for Web Push to work, an additional server is required that would encrypt and send the notification. This is achieved with an Azure Functions which handles this computation but this is a small amount of NodeJS code which could be hosted anywhere accessible for the Flow to call. The code for this can be found [here](https://dev.azure.com/tdashworth/Power%20Notify/_git/power-notify?path=%2FAzure). 

It's worth noting that the server is **very** generic and is not tied to an environment which means it can be used for multiple such as dev, CI/CD, and test. The server requires a set of keys, public and private, which are used for the encryption a subject (email). The keys need to first be generated which the function logs out upon making a request without them set and then persistently stored in the function environment variables (`vapidPrivateKey`, `vapidPublicKey`). The subject is the primary contact for the subscription which is optional (see section 2.1 [here](https://datatracker.ietf.org/doc/rfc8292/?include_text=1)).

The public key also needs to be retained within the PowerPlatform for the user to access enabling them to decrypt the notification upon delivery. Please save that value in the environment variable called `Web Push Public Key`.

The Flow that triggers this process is bound to a custom connector which defines the routes available on the webserver. Once your server is running, update the connector with your server's details (URL and authentication) and save the connector. 

# Additional Configuration
By now you should still have a remaining environment variable to populate. Called `Default App Id`, this is used by the Flow to inject in the App Id of the PowerApp your users will typically use (and therefore want to open upon clicking a notification). You must create a value for the variable but it can be left blank resulting in the user selecting an app.

Next, and importantly, you need to activate the Flows in the solution. This isn't activated on install because it requires some connections to be set up. 
1) Open the editor for the Flow.
2) You should be greeted with a dialogue asking for four connections.
   - CDS Current Environment - this is a premium connector so make sure as the logged-on user you have a licence
   - Web Push Forwarding Server - this is what you previously configured and now need to create a connection with authentication
   - Mail - out-of-the-box PowerApp mail sender
   - PowerApps Notification - used to send the mobile notification. The solution contains an app called "Notification Tray" which should be the app id provided.
3) **Save!**
4) Go back to the details screen and activate if not already done so. 


All these configurations can be added to your own unmanaged solution if you'd like them to migrate with your solution. I'd recommend the `Default App Id` is not included in that at all as it will always be different. The other environment variable and custom connector could be added but I'd imagine they would change for production so manually configuring for each environment is recommended.


# Test
You are now configured and can test your set up.
1) Create an Event record. Right now a temporary one will do. **- LP Where is best to do this?**
2) Click in the bell icon within the application ribbon (top-right of the screen) 
3) Create a new Notification Subscription selecting your newly created Channel and all the methods.
4) [Optional] If you wish the use the Web Push method, click subscribe in the Device Subscriptions control and click `Allow` in the browsers permission pop-up. **- Screenshot?**
5) Create a new Notification Message Activity setting the Owner to yourself and the Channel to the one you are subscribed to. Add a subject, description, and regarding record then save.
6) Just wait... you should:
   - receive an email to your primary email address
   - receive a web push notification from your browser
   - be able to view the Message in the Notification Tray in the browser via the notification symbol in the top ribbon and on the mobile PowerApps app if you open the specific PowerApp.
   - not receive a mobile push notification **unless** you have previously opened the Notification Tray app in the mobile PowerApp app. 

If something does fail here unexpectedly, have a look the Flow within the Power Notify solution for any failures.

# Channels and Messages
...
