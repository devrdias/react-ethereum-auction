import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions } from 'react-router-redux'

// Layout Component Wrappers

export const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user.data.userType,
  redirectAction: routerActions.replace,
  failureRedirectPath: '/signup', // '/login' by default.
  wrapperDisplayName: 'UserIsAuthenticated',
})

export const UserIsNotAuthenticated = UserAuthWrapper({
  authSelector: state => state.user.data.userType,
  redirectAction: routerActions.replace,
  failureRedirectPath: (state, ownProps) => ownProps.location.query.redirect || '/',
  wrapperDisplayName: 'UserIsNotAuthenticated',
})  

// UI Component Wrappers

export const VisibleOnlyAuth = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'VisibleOnlyAuth',
  predicate: user => user.data.userType,
  FailureComponent: null
})

export const HiddenOnlyAuth = UserAuthWrapper({
  authSelector: state => state.user.data,
  wrapperDisplayName: 'HiddenOnlyAuth',
  predicate: data => data.userType === '',
  FailureComponent: null
})

export const VisibleOnlySeller = UserAuthWrapper({
  authSelector: state => state.user.data,
  wrapperDisplayName: 'VisibleOnlySeller',
  predicate: data => data.userType === 'Seller',
  FailureComponent: null
})

export const VisibleOnlyBuyer = UserAuthWrapper({
  authSelector: state => state.user.data,
  wrapperDisplayName: 'VisibleOnlyBuyer',
  predicate: data => data.userType === 'Buyer',
  FailureComponent: null
})

export const VisibleOnlyOwner = UserAuthWrapper({
  authSelector: state => state.user.data,
  wrapperDisplayName: 'VisibleOnlyOwner',
  predicate: data => data.userType === 'Owner',
  FailureComponent: null
})

export const VisibleOnlyArbiter = UserAuthWrapper({
  authSelector: state => state.user.data,
  wrapperDisplayName: 'VisibleOnlyArbiter',
  predicate: data => data.userType === 'Arbiter',
  FailureComponent: null
})
