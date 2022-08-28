import { db, auth, googleProvider } from '../firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import TextField from '@material-ui/core/TextField';
import { Button, Paper } from '@material-ui/core';
import { ILoginUser } from '../models/ILoginUser';
import { useForm } from '../hooks/useForm';
import { Link } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import { Helmet } from 'react-helmet-async';
import { helmetData } from '../utils/helmetData';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const Login = () => {
  const {
    form: loginInfo,
    handleChange,
    handleSubmit,
    clearInfo,
    formIsValid,
  } = useForm(
    {
      email: '',
      password: '',
    },
    (loginData: ILoginUser) => {
      handleLoginSubmit(loginData);
    }
  );

  const navigate = useNavigate();

  const googleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential?.accessToken;
      console.log('TOKEN: ', token);
      const { user } = res;
      const firstName = user.displayName
        ? user.displayName.split(' ')[0]
        : null;
      const lastName = user.displayName ? user.displayName.split(' ')[1] : null;
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      await setDoc(
        userRef,
        {
          firstName,
          lastName,
          email: user.email,
          favorites: userDoc.data()?.favorites ?? [],
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
      navigate('/');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
    clearInfo();
  };

  const handleLoginSubmit = async (loginInfo: ILoginUser) => {
    const { email, password } = loginInfo;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      clearInfo();
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <>
      <Helmet helmetData={helmetData}>
        <title>Login | Krypto Watcher</title>
      </Helmet>
      <div className={styles.login}>
        <Paper className={styles.login__paper}>
          <h1 className={styles.login__header}>Login</h1>
          <form onSubmit={handleSubmit} className={styles.login__form}>
            <TextField
              className={styles.login__input}
              type='email'
              placeholder='Email'
              label={loginInfo.email.length > 0 ? 'Email' : ''}
              name='email'
              value={loginInfo.email}
              onChange={handleChange}
            />
            <TextField
              className={styles.login__input}
              type='password'
              placeholder='Password'
              label={loginInfo.password.length > 0 ? 'Password' : ''}
              name='password'
              value={loginInfo.password}
              onChange={handleChange}
            />
            <Button
              className={styles.login__logInBtn}
              type='submit'
              variant='contained'
              color='primary'
              disabled={!formIsValid()}
            >
              Login
            </Button>
          </form>
          <div className={styles.login__googleContainer}>
            <GoogleButton
              onClick={googleSignIn}
              className={styles.login__googleLogInBtn}
            >
              Google Login
            </GoogleButton>
          </div>
          <div className={styles.linksContainer}>
            <Link to='/register' className={styles.registerLink}>
              Register
            </Link>

            <Link to='/forgot-password' className={styles.forgotLink}>
              Forgot Password
            </Link>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default Login;
