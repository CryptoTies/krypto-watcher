import { db, auth, googleProvider } from '../../firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import styles from '../styles/Login.module.css';
import TextField from '@material-ui/core/TextField';
import { Button, Paper } from '@material-ui/core';
import { ILoginUser } from '../models/ILoginUser';
import useForm from '../hooks/UseForm';

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
    }
    clearInfo();
  };

  const handleLoginSubmit = async (loginInfo: ILoginUser) => {
    const { email, password } = loginInfo;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
    }
    clearInfo();
  };

  return (
    <Paper className={styles.login}>
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
      <p className={styles.login__or}>OR</p>
      <div className={styles.login__googleContainer}>
        <Button
          onClick={googleSignIn}
          variant='contained'
          color='secondary'
          className={styles.login__googleLogInBtn}
        >
          Google Login
        </Button>
      </div>
    </Paper>
  );
};

export default Login;
