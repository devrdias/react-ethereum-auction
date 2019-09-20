# Avoid Common Attacks

Contracts were implemented preventing the following common attacks:

### Reentrancy

Using ReentryProtector.sol to prevent users from calling an external function before the first call finishes.


### Integer Overflow and Underflow

Using SafeMath Library 


### Favor pull over push for external calls

External calls can fail accidentally or deliberately. To minimize the damage caused by such failures, it is often better to isolate each external call into its own transaction that can be initiated by the recipient of the call.


### Avoid state changes after external calls

Avoid state changes after the call. This pattern is also sometimes known as the checks-effects-interactions pattern.


# Solidity specific recommendations

### Enforce invariants with assert()
assert(address(this).balance >= totalSupply);

### Check data length in fallback functions
require(msg.data.length == 0); 


### Explicitly mark visibility in functions and state variables
External functions have external visibility, instead of public. External functions save gas and are more performatic than public.