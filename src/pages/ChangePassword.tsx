import { useState, useEffect } from 'react';
import styles from '../styles/ChangePassword.module.css';
import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { EProvider } from '../models/EProvider';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [authUser, authLoading] = useAuthState(auth);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  useEffect(() => {
    if (!authUser && !authLoading) {
      navigate('/login');
    }

    if (
      authUser &&
      (authUser as any)?.reloadUserInfo?.providerUserInfo[0].providerId !==
        EProvider.NATIVE
    ) {
      navigate('/home');
    }
  }, [authUser, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword === newPasswordConfirm) {
      try {
        await updatePassword(authUser!, newPassword);
        alert('Password updated');
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Passwords do not match');
    }
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  return (
    <>
      {authUser && !authLoading && (
        <div className={styles.changePW}>
          <Paper className={styles['changePW__paper']}>
            <form onSubmit={handleSubmit} className={styles['changePW__form']}>
              <div className={styles.inputContainer}>
                <TextField
                  className={styles['pw-input']}
                  type='password'
                  label='Password'
                  name='password'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <TextField
                  className={styles['confirmPW-input']}
                  type='password'
                  label='Confirm Password'
                  name='confirmPassword'
                  value={newPasswordConfirm}
                  onChange={e => setNewPasswordConfirm(e.target.value)}
                />
              </div>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                className={styles.changeBtn}
                disabled={!newPassword || !newPasswordConfirm}
              >
                Change Password
              </Button>
            </form>
          </Paper>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
