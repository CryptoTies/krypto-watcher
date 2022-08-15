import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { EProvider } from '../models/EProvider';
import styles from '../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [authUser, authLoading] = useAuthState(auth);

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!authUser && !authLoading) {
      navigate('/login');
    }

    if (
      authUser &&
      !authLoading &&
      (authUser as any)?.reloadUserInfo?.providerUserInfo[0].providerId !==
        EProvider.NATIVE
    ) {
      navigate('/home');
    }
  }, [authUser, authLoading, navigate]);

  return (
    <div className={styles.forgotPW}>
      {/* <Paper className={styles['forgotPW__paper']}> */}
      <form className={styles['forgotPW__form']}>
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
      {/* </Paper> */}
    </div>
  );
};

export default ForgotPassword;
