import React, { useState } from 'react';

const UseForm = (initialState: any, submitFn: any) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState();

  const validate = () => {
    // this function will check if the form values are valid
  };

  const formIsValid = () => {
    // this function will check if the form values and return a boolean value
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((currForm: any) => ({
      ...currForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitFn(form);
  };

  const clearInfo = () => {
    setForm(initialState);
  };

  return {
    form,
    setForm,
    handleChange,
    handleSubmit,
    clearInfo,
    formIsValid,
    errors,
  };
};

export default UseForm;
