import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { EProvider } from '../models/EProvider';
import { IChangePassword } from '../models/IChangePassword';
import { useForm } from '../hooks/useForm';
import styles from '../styles/ChangePassword.module.css';
import { Helmet } from 'react-helmet-async';
import { helmetData } from '../utils/helmetData';
import { Link } from 'react-router-dom';

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
    (data: IChangePassword) => {
      handleChangePWSubmit(data);
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
    const { oldPassword, newPassword, newPasswordConfirm } = info;

    const credential = EmailAuthProvider.credential(
      authUser?.email as string,
      oldPassword
    );
    try {
      await reauthenticateWithCredential(authUser!, credential);
      if (newPassword !== newPasswordConfirm) {
        throw new Error('New passwords do not match');
      }
      await updatePassword(authUser!, newPassword);
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
        <>
          <Helmet helmetData={helmetData}>
            <title>Change Password | Krypto Watcher</title>
          </Helmet>
          <div className={styles.changePW}>
            <Paper className={styles['changePW__paper']}>
              <h1 className={styles['changePW__header']}>Change Password</h1>
              <form
                onSubmit={handleSubmit}
                className={styles['changePW__form']}
              >
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
            <Link to={`/account/${authUser.uid}`} className={styles.acctLink}>
              Back to Account
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default ChangePassword;
