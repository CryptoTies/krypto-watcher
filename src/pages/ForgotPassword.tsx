import Paper from '@mui/material/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import styles from '../styles/ForgotPassword.module.css';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { helmetData } from '../utils/helmetData';
import { IForgotPassword } from '../models/IForgotPassword';
import useForm from '../hooks/UseForm';

const ForgotPassword = () => {
  const {
    form: info,
    handleChange,
    handleSubmit,
    clearInfo,
    formIsValid,
    errors,
  } = useForm(
    {
      email: '',
    },
    (data: IForgotPassword) => {
      handleResetPassword(data);
    },
    ['phoneNumber']
  );

  const handleResetPassword = async (info: IForgotPassword) => {
    const { email } = info;
    try {
      await sendPasswordResetEmail(auth, email);
      clearInfo();
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
          <form className={styles['forgotPW__form']} onSubmit={handleSubmit}>
            <TextField
              className={styles['forgotPW__input']}
              label='Email'
              type='email'
              value={info.email}
              name='email'
              onChange={handleChange}
              onBlur={handleChange}
              {...(errors['email'] && {
                error: true,
                helperText: errors['email'],
              })}
            />
            <Button
              className={styles['forgotPW__btn']}
              variant='contained'
              color='primary'
              type='submit'
              disabled={!formIsValid()}
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
