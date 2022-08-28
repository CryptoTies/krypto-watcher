import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { IRegisterUser } from '../models/IRegisterUser';
import { Button, Paper } from '@material-ui/core';
import { useForm } from '../hooks/useForm';
import { ECountryCodes } from '../models/ECountryCodes';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { helmetData } from '../utils/helmetData';
import TextField from '@material-ui/core/TextField';
import PhoneInput from 'react-phone-input-2';
import styles from '../styles/Register.module.css';
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const navigate = useNavigate();

  const [validPhoneNumb, setValidPhoneNumb] = useState(true);

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
          phoneNumber:
            phoneNumber && phoneNumber.length > 3 ? '+' + phoneNumber : null,
          favorites: [],
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      clearInfo();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  const handleIsPhoneInputValid = (value: string, country: any) => {
    let periodCount = 0;

    for (const val of country.format) {
      if (val === '.') {
        periodCount += 1;
      }
    }

    let isPhoneNumValid =
      periodCount === value.length
        ? true
        : periodCount === ECountryCodes.DOUBLE_DIGITS_LEN
        ? value.length === ECountryCodes.DOUBLE_DIGITS_LEN - 1
        : value.length === ECountryCodes.TRIPLE_DIGITS_LEN - 2;

    if (value.length === 0 || value === country.dialCode) {
      setValidPhoneNumb(true);
      return true;
    } else if (isPhoneNumValid) {
      setValidPhoneNumb(true);
      return true;
    } else {
      setValidPhoneNumb(false);
      return false;
    }
  };

  return (
    <>
      <Helmet helmetData={helmetData}>
        <title>Register | Kyrpto Watcher</title>
      </Helmet>
      <div className={styles.register}>
        <Paper className={styles.register__paper}>
          <h1 className={styles.register__header}>Register</h1>
          <form onSubmit={handleSubmit} className={styles.register__form}>
            <TextField
              className={styles.register__input}
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
              className={styles.register__input}
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
              className={styles.register__input}
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
            <div className={styles.phoneInput__container}>
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
                isValid={handleIsPhoneInputValid}
              />
            </div>
            <TextField
              className={styles.register__input}
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
              className={styles.register__input}
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
              disabled={!formIsValid() || !validPhoneNumb}
            >
              Register
            </Button>
          </form>
          <div className={styles.haveAcct__container}>
            <p className={styles.haveAcct}>Already have an account?</p>
            <Link to='/login' className={styles.register__link}>
              Login
            </Link>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default Register;
