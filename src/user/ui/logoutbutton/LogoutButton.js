import React, { Component } from 'react'


class LogoutButton extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <li className="pure-menu-item">
        <a href="#" className="pure-menu-link" onClick={(event) => this.props.onLogoutUserClick(event)}>Logout({this.props.role})</a>
      </li>
    )
  }
}

export default LogoutButton
