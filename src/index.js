import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers.js'
import getWeb3 from './util/web3/getWeb3'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from 'components/owner/Dashboard'
import Orders from 'components/buyer/Orders'
import Store from 'components/seller/Store'
import SignUp from './user/layouts/signup/SignUp'
import Profile from './user/layouts/profile/Profile'
import 'semantic-ui-css/semantic.min.css';
import 'index.css';



// Redux Store
import store from './store'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.catch(() => {
  console.log('Error in web3 initialization.')
})

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={UserIsAuthenticated(Home)} />
          <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="orders" component={UserIsAuthenticated(Orders)} />
          <Route path="store" component={UserIsAuthenticated(Store)} />
          <Route path="signup" component={SignUp} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />          
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
