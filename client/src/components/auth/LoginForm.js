import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';

// Client Side Validation
const required = (value) =>
  value || typeof value === 'number' ? undefined : 'Required';
const minLength = (min) => (value) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
const minLength4 = minLength(4);
const minLength8 = minLength(8);
const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength20 = maxLength(20);

// Redux-Form JSX ==> html tags
const renderField = ({ input, label, type, meta: { touched, error } }) => {
  const className = `field ${error && touched ? 'error' : ''}`;
  return (
    <div className={className}>
      <label>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type} autoComplete="off" />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );
};

const LoginForm = (props) => {
  const { error, handleSubmit } = props;

  const onSubmit = async (formValues) => {
    await props.onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
      <Field
        name="username"
        type="text"
        component={renderField}
        validate={[minLength4, maxLength20, required]}
        label="Username"
      />
      <Field
        name="password"
        type="password"
        component={renderField}
        validate={[minLength8, maxLength20, required]}
        label="Password"
      />
      <div className="login-signup-link">
        <span>Not a Member?</span>
        <Link to="/signup">Sign up</Link>
      </div>
      {error && <strong>{error}</strong>}
      <div className="login-button">
        <button className="ui button primary" type="submit">
          LOGIN
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'loginForm',
})(LoginForm);
