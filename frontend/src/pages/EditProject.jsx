import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/campaigns/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const campaign = response.data;
      setFormData({
        title: campaign.title,
        description: campaign.description,
        target_amount: campaign.target_amount,
        start_date: campaign.start_date,
        end_date: campaign.end_date
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      if (error.response?.status === 404) {
        setError('Campaign not found.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to edit this campaign.');
      } else {
        setError('Failed to load campaign. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required.');
      setSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required.');
      setSubmitting(false);
      return;
    }
    if (!formData.target_amount || parseFloat(formData.target_amount) < 100) {
      setError('Target amount must be at least $100.');
      setSubmitting(false);
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      setError('Start date and end date are required.');
      setSubmitting(false);
      return;
    }
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError('End date must be after start date.');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://localhost:8000/api/campaigns/${id}/`, {
        ...formData,
        target_amount: parseFloat(formData.target_amount)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Campaign updated successfully!');
      setTimeout(() => {
        navigate('/my-projects');
      }, 1500);
    } catch (error) {
      console.error('Error updating campaign:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(errorData);
        }
      } else {
        setError('Failed to update campaign. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={() => navigate('/my-projects')}
          >
            Back to My Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">✏️ Edit Campaign</h3>
            </div>
            <div className="card-body">
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Success!</strong> {success}
                  <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Campaign Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter campaign title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your campaign..."
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="target_amount" className="form-label">Target Amount ($) *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="target_amount"
                      name="target_amount"
                      value={formData.target_amount}
                      onChange={handleChange}
                      placeholder="Enter target amount"
                      min="100"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-text">Minimum amount: $100.00</div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="start_date" className="form-label">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="end_date" className="form-label">End Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-fill"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      '💾 Update Campaign'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/my-projects')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject; 