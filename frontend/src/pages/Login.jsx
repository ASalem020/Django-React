import React from 'react';
import { Formik } from 'formik';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
  const navigate = useNavigate();
  const { updateLoginState } = useOutletContext();
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#000' }}
    >
      <div
        className="card p-4 border border-light shadow"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'black',
          color: '#fff',
          borderRadius: '10px',
        }}
      >
        <h2 className="text-center mb-4 text-white">Sign In</h2>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.username) errors.username = 'Username is required';
            if (!values.password) errors.password = 'Password is required';
            return errors;
          }}

          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              const res = await axios.post('http://localhost:8000/auth/jwt/create/', {
                username: values.username,
                password: values.password,
              });
              const { access, refresh } = res.data;
              localStorage.setItem('access_token', access);
              localStorage.setItem('refresh_token', refresh);
              axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

              // Update the login state in the parent component
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userData', JSON.stringify({ name: values.username }));
              if (updateLoginState) updateLoginState();
              const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
              localStorage.removeItem('redirectAfterLogin');
              navigate(redirectPath);
            } catch (error) {
                let errorMessage = 'Login failed. Please check your credentials.';
                if (error.response?.status === 401) {
                  errorMessage = 'Invalid username or password';
                }
                setStatus({ error: errorMessage });
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
              {status?.error && <div className="alert alert-danger">{status.error}</div>}
              <div className="mb-3">
                <label htmlFor="username" className="form-label text-white">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.username && touched.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-white">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.password && touched.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100">
                Login
              </button>
              <button
                type="button"
                className="btn btn-link w-100 mt-2 text-decoration-none text-primary"
                onClick={() => navigate('/register')}
              >
                Don't have an account? Register
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login; 