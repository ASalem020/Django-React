import React from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Alert, Stack, Typography, Box } from '@mui/material';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// Validation schema
const campaignSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(5).max(100),
  description: Yup.string().required('Description is required').min(20),
  target_amount: Yup.number().required().min(100).label('Target Amount'),
  start_date: Yup.date()
    .min(dayjs().add(1, 'day').toDate(), 'Start date must be in the future')
    .required(),
  end_date: Yup.date()
    .min(Yup.ref('start_date'), 'End date must be after start date')
    .required(),
});

const CreateProject = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Create New Campaign</Typography>

      <Formik
        initialValues={{
          title: '',
          description: '',
          target_amount: '',
          start_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
          end_date: '',
          image: ''
        }}
        validationSchema={campaignSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await axios.post('http://localhost:8000/api/campaigns/', {
              ...values,
              target_amount: parseFloat(values.target_amount)
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
              }
            });
            setStatus({ success: 'Campaign created successfully!' });
            setTimeout(() => navigate('/'), 1500);
          } catch (error) {
            setStatus({
              error: error.response?.data?.message || 'Failed to create campaign'
            });
          } finally {
            setSubmitting(false);
          }
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
            {status?.success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {status.success}
              </Alert>
            )}
            {status?.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {status.error}
              </Alert>
            )}

            <Stack spacing={3}>
              <TextField
                name="title"
                label="Campaign Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                fullWidth
                required
              />

              <TextField
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                multiline
                rows={4}
                fullWidth
                required
              />

              <TextField
                name="target_amount"
                label="Target Amount ($)"
                type="number"
                value={values.target_amount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.target_amount && Boolean(errors.target_amount)}
                helperText={touched.target_amount && errors.target_amount}
                InputProps={{ inputProps: { min: 100, step: 1 } }}
                fullWidth
                required
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  name="start_date"
                  label="Start Date"
                  type="date"
                  value={values.start_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.start_date && Boolean(errors.start_date)}
                  helperText={touched.start_date && errors.start_date}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />

                <TextField
                  name="end_date"
                  label="End Date"
                  type="date"
                  value={values.end_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.end_date && Boolean(errors.end_date)}
                  helperText={touched.end_date && errors.end_date}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateProject;