import React, { useState } from 'react';

import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { db, auth, googleProvider } from '../../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

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
      const user = res.user;
      const firstName = user.displayName
        ? user.displayName.split(' ')[0]
        : null;
      const lastName = user.displayName ? user.displayName.split(' ')[1] : null;
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          firstName,
          lastName,
          email: user.email,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
      console.log('USER GOOGLE LOGGED IN: ', user);
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          name='email'
          value={loginInfo.email}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={loginInfo.password}
          onChange={handleChange}
        />
        <button type='submit'>Login</button>
      </form>
      <button onClick={googleSignIn}>Google Login</button>
    </div>
  );
};

export default Login;
