import React, { Component } from 'react'
import { PropTypes } from 'prop-types';
import classes from './Navbar.scss'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  pathToJS,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import {
  LIST_PATH,
  ACCOUNT_PATH,
  TRANSFER_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
  CREATE_FAUCET_PATH
} from 'constants/paths'

// Components
import AppBar from 'material-ui/AppBar'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import Avatar from 'material-ui/Avatar'

import defaultUserImage from 'static/User.png'

const buttonStyle = {
  color: 'white',
  textDecoration: 'none',
  alignSelf: 'center'
}

const avatarStyles = {
  wrapper: { marginTop: 0 },
  button: { marginRight: '.5rem', width: '200px', height: '64px' },
  buttonSm: { marginRight: '.5rem', width: '30px', height: '64px', padding: '0' }
}

@firebaseConnect()
@connect(
  ({ firebase, faucet }) => ({
    authError: pathToJS(firebase, 'authError'),
    auth: pathToJS(firebase, 'auth'),
    account: pathToJS(firebase, 'profile'),
    faucet: faucet
  })
)
export default class Navbar extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    auth: PropTypes.object,
    account: PropTypes.object,
    firebase: PropTypes.object.isRequired
  }

  handleLogout = () => {
    this.props.firebase.logout()
    this.context.router.push('/')
  }

  render() {
    const { account, faucet } = this.props
    const accountExists = isLoaded(account) && !isEmpty(account)
    const iconButton = (
      <IconButton style={avatarStyles.button} disableTouchRipple>
        <div className={classes.avatar}>
          <div className='hidden-mobile'>
            <Avatar
              src={accountExists && account.avatarUrl ? account.avatarUrl : defaultUserImage}
            />
          </div>
          <div className={classes['avatar-text']}>
            <span className={`${classes['avatar-text-name']} hidden-mobile`}>
              {accountExists && account.displayName ? account.displayName : 'User'}
            </span>
            <DownArrow color='white' />
          </div>
        </div>
      </IconButton>
    )

    const mainMenu = (
      <div className={classes.menu}>
        <Link to={SIGNUP_PATH}>
          <FlatButton
            label='Sign Up'
            style={buttonStyle}
          />
        </Link>
        <Link to={LOGIN_PATH}>
          <FlatButton
            label='Login'
            style={buttonStyle}
          />
        </Link>
        <FlatButton
          href='https://github.com/OR13/car2go'
          label='Source'
          style={buttonStyle}
        />
      </div >
    )

    const rightMenu = accountExists ? (
      <IconMenu
        iconButtonElement={iconButton}
        targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        animated={false}
      >
        <MenuItem
          primaryText='Account'
          onTouchTap={() => this.context.router.push(ACCOUNT_PATH)}
        />
        <MenuItem
          primaryText='Transfer'
          onTouchTap={() => this.context.router.push(TRANSFER_PATH)}
        />
        <MenuItem
          primaryText='Sign out'
          onTouchTap={this.handleLogout}
        />
      </IconMenu>
    ) : mainMenu

    return (
      <AppBar
        title={
          <Link to={accountExists ? `${LIST_PATH}` : '/'} className={classes.brand}>
            Mesh ISP
          </Link>
        }
        showMenuIconButton={false}
        iconElementRight={rightMenu}
        iconStyleRight={accountExists ? avatarStyles.wrapper : {}}
        className={classes.appBar}
      />
    )
  }
}
