import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { EProvider } from '../models/EProvider';
import { IChangePassword } from '../models/IChangePassword';
import useForm from '../hooks/UseForm';
import styles from '../styles/ChangePassword.module.css';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [authUser, authLoading] = useAuthState(auth);

  const {
    form: info,
    handleChange,
    handleSubmit,
    clearInfo,
  } = useForm(
    {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    (info: IChangePassword) => {
      handleChangePWSubmit(info);
    }
  );

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

  const handleChangePWSubmit = async (info: IChangePassword) => {
    const credential = EmailAuthProvider.credential(
      authUser?.email as string,
      info.oldPassword
    );
    try {
      await reauthenticateWithCredential(authUser!, credential);
      if (info.newPassword !== info.newPasswordConfirm) {
        throw new Error('New passwords do not match');
      }
      await updatePassword(authUser!, info.newPassword);
      alert('Password updated');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
    clearInfo();
  };

  return (
    <>
      {authUser && !authLoading && (
        <div className={styles.changePW}>
          <Paper className={styles['changePW__paper']}>
            <form onSubmit={handleSubmit} className={styles['changePW__form']}>
              <div className={styles.inputContainer}>
                <TextField
                  className={styles['oldPW-input']}
                  type='password'
                  label='Old Password'
                  name='oldPassword'
                  value={info.oldPassword}
                  onChange={handleChange}
                />
                <TextField
                  className={styles['newPW-input']}
                  type='password'
                  label='New Password'
                  name='newPassword'
                  value={info.newPassword}
                  onChange={handleChange}
                />
                <TextField
                  className={styles['confirmPW-input']}
                  type='password'
                  label='Confirm Password'
                  name='newPasswordConfirm'
                  value={info.newPasswordConfirm}
                  onChange={handleChange}
                />
              </div>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                className={styles.changeBtn}
                disabled={
                  !info.oldPassword ||
                  !info.newPassword ||
                  !info.newPasswordConfirm
                }
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
