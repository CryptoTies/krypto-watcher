import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import styles from '../styles/Header.module.css';

const Header = () => {
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

  return (
    <header>
      <nav className={styles.navbar}>
        <ul className={styles.navbar__list}>
          <li>
            <Link to='/login'>Login</Link>
          </li>
          <li>
            <Link to='/register'>Register</Link>
          </li>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <span onClick={handleSignOut} className={styles.navbar__logout}>
              Logout
            </span>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
