import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import { resetPassword } from '../utils/resetPassword';
import styles from '../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let res = await resetPassword(email);
    console.log('RES: ', res);
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
