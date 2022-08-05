import React, { useState } from 'react';

const UseForm = (
  initialState: any,
  submitFn: any,
  optionalFields?: string[]
) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({} as any);

  const validate = (form: any) => {
    let tempErrors: any = { ...errors };

    for (let key in form) {
      if (key === 'email' && form[key]) {
        tempErrors[key] = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)
          ? ''
          : 'Email is not valid';
      } else if (form[key]) {
        tempErrors[key] = '';
      } else {
        tempErrors[key] = 'This field is required';
      }
    }
    setErrors({
      ...tempErrors,
    });
  };

  const formIsValid = () => {
    let isValid = true;

    for (let key in initialState) {
      if (Array.isArray(optionalFields) && optionalFields.includes(key)) {
        continue;
      }
      if (!form[key]) {
        isValid = false;
      }
    }

    return isValid && Object.values(errors).every(x => x === '');
  };

  const handleChange = (e: any) => {
    setForm((currForm: any) => ({
      ...currForm,
      [e.target.name]: e.target.value,
    }));
    validate({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid()) {
      submitFn(form);
    }
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
