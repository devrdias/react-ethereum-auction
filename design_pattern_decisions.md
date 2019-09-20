# Design Patter Decisions

### Restricting Access
This is a common patter for contracts, where you can restrict access to contract's state.

### Contract Self Destruction
These contracts must be audited and reviewed by an sennior solidity developer.
    
After Developer course ends, I'll destroy this contracts and will work on improvments, so I can deploy a new version of it.

### Withdrawal Pattern
Let users request to move out funds from contracts prevents blocking all accounts from wihdraw if a transfer or send function fails.
The better approach is let users call withdraw funds on demand, individually.

### State Machina
I decided to use state machine to control the flow of a purchase, so product evolves from: For Sale to Sold, Shipped, etc , always depending on previous state.
