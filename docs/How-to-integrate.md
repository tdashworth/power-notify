Before reading this page, please read the [technical design](./Technical-design.md) page for nessassary context.

Integrating with Power Notify is simple. User's manage Notification Subscriptions which link them to Notification Events while describing how they'd like to be notified, if at all. The system emits Notification Messages which also link to Notification Events and a User/Team to notify. 

After [installing](./Installation.md) the managed solution into your environment, you can begin integrating with Power Notify. As a system developer there are a few methods to you could use:

1. Build new Flows, Workflows or Plugins which create the Notification Messages upon certain system events (create, update, delete, custom actions). 
2. Modify existing business Flows, Workflows or Plugins which create Notification Messages upon more complex business events.
3. Create Notification Messages via the WebAPI (or XRM SDK) externally from the Power Platform. 

_Note: If given the permissions, citizen developers can also utilise method (1) to build personal/team events._

If your system currently sends emails to it's internal users, that's a great candidate to replace with Notification Messages with appropriate Notification Events. 

Regarding Notification Events, I'd recommend migrating these records from your development environment through to test, staging, and production to guarantee their existances. This also means they can be referenced by their GUID (record primary key) which saves searching by name. 

Sample Flows can be found in the Samples solution found in the repo/release. These include: 

- Notify Owner when Account is updated
- Notify Followers when Contact is updated
