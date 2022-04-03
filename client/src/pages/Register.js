import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

import { useMutation } from '@apollo/client';
import { REGISTER_USER_MUTATION } from '../util/graphql';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

import { useForm } from '../util/hooks';

const Register = (props) => {
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    update(_, { data: { register: userData }}) {
      dispatch(login(userData))
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].message);
    },
    variables: values
  });

  function registerUser() {
    setErrors({})
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="username"
          name="username"
          type="text"
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="email@gmail.com"
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="********"
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="********"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          {errors}
        </div>
      )}
    </div>
  );
}

export default Register;