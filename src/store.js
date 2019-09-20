import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducer from './reducer'
import Initial from './initialstate.json'

console.log("track_99")
console.log(Initial)

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routingMiddleware = routerMiddleware(browserHistory) 

const store = createStore(
  reducer,
  //{common:{data:Initial}},
  composeEnhancers(
    applyMiddleware(
//    logger,
      thunkMiddleware,
      routingMiddleware
    )
  )
)

export default store
