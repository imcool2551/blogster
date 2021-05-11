import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';

const LoginForm = (props) => {
  const { error, handleSubmit } = props;

  const renderField = ({ input, label, type, meta: { touched, error } }) => {
    const className = `field ${error && touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <div>
          <input
            {...input}
            placeholder={label}
            type={type}
            autoComplete="off"
          />
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    );
  };

  const onSubmit = async (formValues) => {
    try {
      await props.onSubmit(formValues);
    } catch (err) {
      console.log(err.response.data);
      if (err.response.status === 400) {
        // 유효성 검사 실패
        err.response.data.errors.forEach((e) => {
          throw new SubmissionError({
            [e.param]: e.message,
            _error: 'Login failed!',
          });
        });
      } else {
        // 인증 실패
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
        label="Username"
      />
      <Field
        name="password"
        type="password"
        component={renderField}
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
