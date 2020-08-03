Power Notify is a Power Apps solution and designed to be reusable on any Power Apps project through simply installing and following the setup guide [here](How-to-set-up-Power-Notify). 

# Problem
The problem Power Notify is trying to solve is one faced by many projects I've come across, informing their internal users when something in the system has happened. This could be something actionable like your approval is required or informative like something you own/follow was updated. Traditionally, this has been achieved through emails, which from experience can quickly annoy the users reverting to a mailbox rule to wick them away for the user's attention. - LP (reword slightly)

# Solution
How Power Notify solves this is by decoupling the system events to inform a user and delivering that to the user. Taking inspiration from various implementations of this, the user is now in control of **what** and **how** they are informed of system events through subscribing to "events" and specifying zero, one, or many methods of delivery. These methods include:
- traditional emails,
- modern browser web push,
- Power Apps mobile push,
- and an embedded notification tray within model-driven apps.

# Features
- Create / Manage events to be notified by
- Subscribe to an event
- Receive notifications via browser/desktop, mobile, email, within the app itself

# Next steps
- [Installation](/installation)
- [How to use](/how-to-use)
- [Technical Design](/technical-design)