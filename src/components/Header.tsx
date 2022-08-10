import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    if (location.pathname === '/login') {
      alert('You are already signed out');
      return;
    }

    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNewAccount = async () => {
    try {
      await signOut(auth);
      navigate('/register');
    } catch (err) {
      console.error(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAcctClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActMenu = () => {
    setAnchorEl(null);
  };

  let activeStyle = {
    color: 'gold',
    fontWeight: 'bolder',
  };

  let unActiveStyle = {
    color: 'white',
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <ul className={styles.navbar__list}>
          <li>
            <NavLink
              to='/home'
              style={({ isActive }) => (isActive ? activeStyle : unActiveStyle)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/my-cryptos'
              style={({ isActive }) => (isActive ? activeStyle : unActiveStyle)}
            >
              My Cryptos
            </NavLink>
          </li>

          {authUser && (
            <>
              <Box className={styles.profile__box}>
                <Tooltip title='Account settings'>
                  <IconButton
                    onClick={handleAcctClick}
                    size='small'
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                  >
                    {authUser.photoURL ? (
                      <Avatar src={authUser.photoURL} />
                    ) : (
                      <Avatar>{authUser.displayName?.[0].toUpperCase()}</Avatar>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id='account-menu'
                open={open}
                onClose={handleCloseActMenu}
                onClick={handleCloseActMenu}
                PaperProps={{
                  elevation: 0,
                }}
              >
                <p className={styles.myAccount__name}>{authUser.displayName}</p>
                <p className={styles.myAccount__email}>{authUser.email}</p>
                <Divider />
                <MenuItem
                  onClick={() => navigate(`/account/${authUser.uid}`)}
                  className={styles.myAccount__container}
                >
                  <Avatar className={styles.myAccount__icon} /> My account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCreateNewAccount}>
                  <ListItemIcon>
                    <SwitchAccountIcon fontSize='small' />
                  </ListItemIcon>
                  Create new account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <ListItemIcon>
                    <Logout fontSize='small' />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
