import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import styles from '../styles/ForgotPassword.module.css';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { helmetData } from '../utils/helmetData';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setEmail('');
      alert('Password reset email sent');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <>
      <Helmet helmetData={helmetData}>
        <title>Forgot Password | Krypto Watcher</title>
      </Helmet>
      <div className={styles.forgotPW}>
        <Paper className={styles['forgotPW__paper']}>
          <h1 className={styles['forgotPW__header']}>Forgot Password</h1>
          <form
            className={styles['forgotPW__form']}
            onSubmit={handleResetPassword}
          >
            <TextField
              className={styles['forgotPW__input']}
              label='Email'
              type='email'
              value={email}
              name='email'
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              className={styles['forgotPW__btn']}
              variant='contained'
              color='primary'
              type='submit'
              disabled={!email}
            >
              Reset Password
            </Button>
          </form>
        </Paper>
      </div>
    </>
  );
};

export default ForgotPassword;
