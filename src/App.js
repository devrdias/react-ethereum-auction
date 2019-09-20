import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth,VisibleOnlySeller, VisibleOnlyBuyer, VisibleOnlyOwner, VisibleOnlyArbiter } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Home</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/orders" className="pure-menu-link">Orders</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlySellerLinks = VisibleOnlySeller(()=>
      <span>
        {/* <li className="pure-menu-item">
          <Link activeClassName="active" to="/" className="pure-menu-link">Home</Link>
        </li> */}
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/store" className="pure-menu-link">Store</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/orders" className="pure-menu-link">Orders</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/profile" className="pure-menu-link">Account</Link>
        </li>
        <LogoutButtonContainer role="Seller"/>
      </span>
    )

    const OnlyBuyerLinks = VisibleOnlyBuyer(()=>
      <span>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/" className="pure-menu-link">Home</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/orders" className="pure-menu-link">Orders</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/profile" className="pure-menu-link">Account</Link>
        </li>
        <LogoutButtonContainer role="Buyer"/>
      </span>
    )

    const OnlyOwnerLinks = VisibleOnlyOwner(()=>
      <span>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/" className="pure-menu-link">Home</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/profile" className="pure-menu-link">Account</Link>
        </li>
        <LogoutButtonContainer role="Owner"/>
      </span>
    )

    const OnlyArbiterLinks = VisibleOnlyArbiter(()=>
      <span>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/" className="pure-menu-link">Home</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/orders" className="pure-menu-link">Orders</Link>
        </li>
        <li className="pure-menu-item">
          <Link activeClassName="active" to="/profile" className="pure-menu-link">Account</Link>
        </li>
        <LogoutButtonContainer role="Arbiter" />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/signup" className="pure-menu-link">Sign Up</Link>
        </li>
        <LoginButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlySellerLinks/>
            <OnlyBuyerLinks/>
            <OnlyOwnerLinks/>
            <OnlyArbiterLinks/>
          </ul>
          <Link  className="pure-menu-heading pure-menu-link">markEth</Link>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default App
