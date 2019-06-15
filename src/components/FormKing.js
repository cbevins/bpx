import React from 'react';
import useFormKing from './useFormKing';

function validateFormKing(values) {
  let errors = {};
  if (!values.email) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  return errors;
}

const FormKing = () => {
  const { values, handleChange, handleSubmit, errors } =
    useFormKing(login, validateFormKing);

  function login() {
    console.log(values);
  }

  return (
    <div className="section is-fullheight">
      <div className="container">
        <div className="column is-4 is-offset-4">
          <div className="box">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Email Address</label>
                <div className="control">
                  <input className={`input ${errors.email && 'is-danger'}`}
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={values.email || ''}
                    required />
                  {errors.email && (
                    <p className="help is-danger">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className={`input ${errors.email && 'is-danger'}`}
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password || ''}
                    required />
                </div>
              </div>
              <button type="submit"
                className="button is-block is-info is-fullwidth">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormKing;