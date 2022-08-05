import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { IRegisterUser } from '../models/IRegisterUser';
import styles from '../styles/Register.module.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TextField from '@material-ui/core/TextField';
import { Button, Paper } from '@material-ui/core';
import useForm from '../hooks/UseForm';

const Register = () => {
  const navigate = useNavigate();

  const {
    form: registerInfo,
    setForm: setRegisterInfo,
    handleChange,
    handleSubmit,
    clearInfo,
    formIsValid,
    errors,
  } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    (registerData: IRegisterUser) => {
      handleRegisterSubmit(registerData);
    },
    ['phoneNumber']
  );

  const handleRegisterSubmit = async (registerInfo: IRegisterUser) => {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
    } = registerInfo;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(
        userDoc,
        {
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumber ? '+' + phoneNumber : null,
          favorites: [],
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
    clearInfo();
  };

  return (
    <Paper className={styles.register}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className={styles.register__form}>
        <TextField
          type='text'
          label='First Name*'
          name='firstName'
          value={registerInfo.firstName}
          onChange={handleChange}
          onBlur={handleChange}
          {...(errors['firstName'] && {
            error: true,
            helperText: errors['firstName'],
          })}
        />
        <TextField
          type='text'
          label='Last Name*'
          name='lastName'
          value={registerInfo.lastName}
          onChange={handleChange}
          onBlur={handleChange}
          {...(errors['lastName'] && {
            error: true,
            helperText: errors['lastName'],
          })}
        />
        <TextField
          type='email'
          label='Email*'
          name='email'
          value={registerInfo.email}
          onChange={handleChange}
          onBlur={handleChange}
          {...(errors['email'] && {
            error: true,
            helperText: errors['email'],
          })}
        />
        <PhoneInput
          containerStyle={{ marginTop: '1.7rem' }}
          inputStyle={{ width: '100%' }}
          country={'us'}
          value={registerInfo.phoneNumber}
          onChange={phoneNumber => {
            setRegisterInfo((currRegisterInfo: IRegisterUser) => ({
              ...currRegisterInfo,
              phoneNumber,
            }));
          }}
        />
        <TextField
          type='password'
          label='Password*'
          name='password'
          value={registerInfo.password}
          onChange={handleChange}
          onBlur={handleChange}
          {...(errors['password'] && {
            error: true,
            helperText: errors['password'],
          })}
        />
        <TextField
          type='password'
          label='Confirm Password*'
          name='confirmPassword'
          value={registerInfo.confirmPassword}
          onChange={handleChange}
          onBlur={handleChange}
          {...(errors['confirmPassword'] && {
            error: true,
            helperText: errors['confirmPassword'],
          })}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          className={styles.register__btn}
          disabled={!formIsValid()}
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
