import _ from 'lodash';
import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';

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
const email = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;
const passwordMatch = (value, allValues) =>
  value !== allValues.password ? 'Password does not match' : undefined;

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

const SignupForm = (props) => {
  const { error, handleSubmit } = props;

  const onSubmit = async (formValues) => {
    try {
      await props.onSubmit(_.omit(formValues, ['passwordMatch']));
    } catch (err) {
      if (err.response.status === 400) {
        // 중복 닉네임/이메일
        throw new SubmissionError({
          _error: err.response.data.errors[0].message,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
      <Field
        name="email"
        type="email"
        component={renderField}
        validate={[email, required]}
        label="Email"
      />
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
      <Field
        name="passwordMatch"
        type="password"
        component={renderField}
        validate={[passwordMatch]}
        label="Password Validate"
      />
      {error && <strong>{error}</strong>}
      <div className="signup-button">
        <button className="ui button primary" type="submit">
          SIGN UP
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'signupForm',
})(SignupForm);
