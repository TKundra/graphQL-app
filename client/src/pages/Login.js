import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER_MUTATION } from '../util/graphql';

import { useForm } from '../util/hooks';

import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

const Login = (props) => {
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    email: '',
    password: ''
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
    update(_, { data: { login: userData } }) {
      dispatch(login(userData))
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].message);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label="Email"
          placeholder="email@gmail.com"
          name="email"
          type="email"
          value={values.email}
          error={errors.length ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="********"
          name="password"
          type="password"
          value={values.password}
          error={errors.length ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
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

export default Login;