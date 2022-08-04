import React, { useState } from 'react';

const UseForm = (initialState: any, submitFn: any) => {
  const [form, setForm] = useState(initialState);

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

  const handleReset = () => {
    setForm(initialState);
  };

  return [form, setForm, handleChange, handleSubmit, handleReset];
};

export default UseForm;
