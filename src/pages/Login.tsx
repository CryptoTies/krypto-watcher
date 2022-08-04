import React, { useState } from 'react';
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

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo(currLoginInfo => ({
      ...currLoginInfo,
      [e.target.name]: e.target.value,
    }));
  };

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    setLoginInfo({
      email: '',
      password: '',
    });
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
        />
        <TextField
          type='password'
          placeholder='Password'
          name='password'
          value={loginInfo.password}
          onChange={handleChange}
        />
        <Button type='submit' variant='contained' color='primary'>
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
