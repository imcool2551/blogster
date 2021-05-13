import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
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
    try {
      await props.onSubmit(formValues);
    } catch (err) {
      if (err.response.status === 400) {
        // 서버 유효성 검사 실패
        err.response.data.errors.forEach((e) => {
          throw new SubmissionError({
            [e.param]: e.message,
            _error: 'Login failed!',
          });
        });
      } else {
        // 인증 실패 (401, 403)
        throw new SubmissionError({
          _error: err.response.data.errors[0].message,
        });
      }
    }
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
