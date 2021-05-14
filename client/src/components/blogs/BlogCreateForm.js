import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Client Side Validation
const required = (value) =>
  value || typeof value === 'number' ? undefined : 'Required';
const tags = (value) =>
  !/#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/gi.test(value)
    ? 'Invalid tag format'
    : undefined;

// Redux-Form JSX ==> text editor tags
const renderEditor = ({ input, meta: { touched, error } }) => {
  return (
    <div className="field">
      <CKEditor
        data={input.value}
        editor={ClassicEditor}
        onChange={(event, editor) => {
          return input.onChange(editor.getData());
        }}
      />
      {touched && error && <span>{error}</span>}
    </div>
  );
};

const renderImageUpload = ({ input, label }) => {
  return (
    <div className="field">
      <label>{label}</label>
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            console.log(e.target.files);
            return input.onChange(e.target.files);
          }}
        />
      </div>
    </div>
  );
};

// Redux-Form JSX ==> html tags
const renderField = ({
  input,
  label,
  placeholder,
  type,
  meta: { touched, error },
}) => {
  const className = `field ${error && touched ? 'error' : ''}`;
  return (
    <div className={className}>
      <label>{label}</label>
      <div>
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          autoComplete="off"
        />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );
};

const BlogCreateForm = (props) => {
  const { error, handleSubmit } = props;

  const onSubmit = async (formValues) => {
    try {
      await props.onSubmit(formValues);
    } catch (err) {
      if (err.response.status === 400) {
        throw new SubmissionError({
          _error: err.response.data.errors[0].message,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
      <Field
        name="title"
        type="text"
        component={renderField}
        validate={[required]}
        label="Title"
        placeholder={'Title'}
      />
      <Field
        name="tags"
        type="text"
        component={renderField}
        validate={[required, tags]}
        label="Tags"
        placeholder={'#음식#피자#도미노'}
      />
      <Field name="files" component={renderImageUpload} label="Images" />
      <Field name="content" component={renderEditor} validate={[required]} />
      {error && <strong>{error}</strong>}
      <div className="signup-button">
        <button className="ui button primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'blogCreateForm',
})(BlogCreateForm);
