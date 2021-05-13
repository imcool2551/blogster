import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Redux-Form JSX ==> text editor tags
const renderEditor = ({ input }) => {
  return (
    <div className="field">
      <CKEditor
        data={input.value}
        editor={ClassicEditor}
        onChange={(event, editor) => {
          return input.onChange(editor.getData());
        }}
      />
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
    await props.onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
      <Field
        name="title"
        type="text"
        component={renderField}
        label="Title"
        placeholder={'Title'}
      />
      <Field
        name="tags"
        type="text"
        component={renderField}
        label="Tags"
        placeholder={'#음식#피자#도미노'}
      />
      <Field name="files" component={renderImageUpload} label="Images" />
      <Field name="content" component={renderEditor} />
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
