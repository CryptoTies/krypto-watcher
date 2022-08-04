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

  const [registerInfo, setRegisterInfo, handleChange, handleSubmit] = useForm(
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
    }
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
    setRegisterInfo({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <Paper className={styles.register}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className={styles.register__form}>
        <TextField
          type='text'
          label='First Name'
          name='firstName'
          value={registerInfo.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          type='text'
          label='Last Name'
          name='lastName'
          value={registerInfo.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          type='email'
          label='Email'
          name='email'
          value={registerInfo.email}
          onChange={handleChange}
          required
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
          label='Password'
          name='password'
          value={registerInfo.password}
          onChange={handleChange}
          required
        />
        <TextField
          type='password'
          label='Confirm Password'
          name='confirmPassword'
          value={registerInfo.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          className={styles.register__btn}
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
