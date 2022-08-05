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
    errors,
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
      console.log('USER GOOGLE LOGGED IN: ', user);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
    clearInfo();
  };

  const handleLoginSubmit = async (loginInfo: ILoginUser) => {
    const { email, password } = loginInfo;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('LOGGED IN: ', userCredential);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
    }
    clearInfo();
  };

  return (
    <Paper className={styles.login}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          type='email'
          placeholder='Email'
          name='email'
          value={loginInfo.email}
          onChange={handleChange}
          onBlur={handleChange}
          {...(errors['email'] && {
            error: true,
            helperText: errors['email'],
          })}
        />
        <TextField
          type='password'
          placeholder='Password'
          name='password'
          value={loginInfo.password}
          onChange={handleChange}
          onBlur={handleChange}
          {...(errors['password'] && {
            error: true,
            helperText: errors['password'],
          })}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={!formIsValid()}
        >
          Login
        </Button>
      </form>
      <Button onClick={googleSignIn} variant='contained' color='secondary'>
        Google Login
      </Button>
    </Paper>
  );
};

export default Login;
