import React from 'react';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#000' }} 
    >
      <div
        className="card p-4 border border-light shadow"
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'black',
          color: '#fff',
          borderRadius: '10px',
        }}
      >
        <h2 className="text-center mb-4 text-white">Sign Up</h2>

        <Formik
          initialValues={{
            username: '',
            email: '',
            phone: '',
            password: '',
            re_password: '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.username) errors.username = 'Username is required';
            if (!values.email) errors.email = 'Email is required';
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
              errors.email = 'Invalid email';
            if (!values.phone) errors.phone = 'Phone is required';
            else if (!/^01[0125][0-9]{8}$/.test(values.phone))
              errors.phone = 'Invalid Egyptian phone';
            if (!values.password) errors.password = 'Password is required';
            if (values.password !== values.re_password)
              errors.re_password = 'Passwords must match';
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
            try {
              const res = await axios.post('http://localhost:8000/auth/users/', values );

              setStatus({ success: "Registration successful!" });
              resetForm();
            } catch (err) {
              setStatus({
                error:
                  err.response?.data
                    ? JSON.stringify(err.response.data)
                    : 'Something went wrong',
              });
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            status,
          }) => (
            <form onSubmit={handleSubmit}>
              {status?.success && <div className="alert alert-success">{status.success}</div>}
              {status?.error && <div className="alert alert-danger">{status.error}</div>}

              {[
                ['username', 'Username'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['password', 'Password'],
                ['re_password', 'Confirm Password'],
              ].map(([name, label], i) => (
                <div className="mb-3" key={i}>
                  <label htmlFor={name} className="form-label text-white">{label}</label>
                  <input
                    id={name}
                    name={name}
                    type={name.includes('password') ? 'password' : 'text'}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder={label}
                    value={values[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors[name] && touched[name] && (
                    <div className="text-danger">{errors[name]}</div>
                  )}
                </div>
              ))}

              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100">
                Register
              </button>
              <button
                type="button"
                className="btn btn-link w-100 mt-2 text-decoration-none text-primary"
                onClick={() => navigate('/login')}
              >
                Already have an account? Login
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
