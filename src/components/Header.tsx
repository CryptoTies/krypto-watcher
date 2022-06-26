import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <header>
      <nav className={styles.navbar}>
        <section>
          <Link to='/login'>Login</Link>
        </section>
        <section>
          <Link to='/register'>Register</Link>
        </section>
        <section>
          <Link to='/'>Home</Link>
        </section>
      </nav>
    </header>
  );
};

export default Header;
