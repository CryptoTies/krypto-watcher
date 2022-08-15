import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import styles from '../styles/ForgotPassword.module.css';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

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
    <div className={styles.forgotPW}>
      <Paper className={styles['forgotPW__paper']}>
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
  );
};

export default ForgotPassword;
