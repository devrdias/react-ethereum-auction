pragma solidity ^0.4.24;

/// @title help avoid recursive-call attacks.
contract ReentryProtector {

    // true if we are inside an external function
    bool reentryProtector;

    // Mark contract as having entered an external function.
    // Throws an exception if called twice with no externalLeave().
    // For this to work, Contracts MUST:
    //  - call externalEnter() at the start of each external function
    //  - call externalLeave() at the end of each external function
    //  - never use return statements in between enter and leave
    //  - never call an external function from another function
    // WARN: serious risk of contract getting stuck if used wrongly.
    // TODO: use revert or require, need to check
    function externalEnter() internal {
        if (reentryProtector) {
            revert();
        }
        reentryProtector = true;
    }

    // Mark contract as having left an external function.
    // Do this after each call to externalEnter().
    function externalLeave() internal {
        reentryProtector = false;
    }

}