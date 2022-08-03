import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { IRegisterUser } from '../models/IRegisterUser';
import styles from '../styles/Register.module.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const navigate = useNavigate();

  const [registerInfo, setRegisterInfo] = useState<IRegisterUser>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo(currRegisterInfo => ({
      ...currRegisterInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className={styles.register__form}>
        <input
          type='text'
          placeholder='First Name'
          name='firstName'
          value={registerInfo.firstName}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          placeholder='Last Name'
          name='lastName'
          value={registerInfo.lastName}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          placeholder='Email'
          name='email'
          value={registerInfo.email}
          onChange={handleChange}
          required
        />
        <PhoneInput
          country={'us'}
          value={registerInfo.phoneNumber}
          onChange={phoneNumber => {
            setRegisterInfo(currRegisterInfo => ({
              ...currRegisterInfo,
              phoneNumber,
            }));
          }}
        />
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={registerInfo.password}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          placeholder='Confirm Password'
          name='confirmPassword'
          value={registerInfo.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default Register;
