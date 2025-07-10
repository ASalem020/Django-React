
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationLoading, setDonationLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    getCurrentUser();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchDate]);

  const fetchCampaigns = () => {
    setLoading(true);
    API.get('/campaigns/')
      .then(res => {
        console.log('Fetched campaigns:', res.data);
        setCampaigns(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err);
        setLoading(false);
      });
  };

  const getCurrentUser = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode JWT token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  const handleDelete = (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      API.delete(`/campaigns/${campaignId}/`)
        .then(() => {
          fetchCampaigns(); // Refresh the list
        })
        .catch(err => {
          console.error('Error deleting campaign:', err);
        });
    }
  };

  const handleEdit = (campaignId) => {
    // Navigate to edit page
    window.location.href = `/edit-campaign/${campaignId}`;
  };

  const handleDonate = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    setSelectedCampaign(campaign);
    setDonationAmount('');
    setShowDonationModal(true);
  };

  const submitDonation = () => {
    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    setDonationLoading(true);
    const donationData = {
      campaign: selectedCampaign.id,
      amount: parseFloat(donationAmount)
    };

    API.post('/donations/', donationData)
    .then(response => {
      // Close modal and reset form
      setShowDonationModal(false);
      setDonationAmount('');
      setSelectedCampaign(null);
      
      // Show success alert
      alert('🎉 Thank you for your donation! Your contribution has been successfully processed.');
      
      // Refresh campaigns to show updated progress
      fetchCampaigns();
      
      console.log('Donation successful:', response.data);
    })
    .catch(error => {
      console.error('Error making donation:', error);
      if (error.response?.status === 401) {
        showToast('Please log in to make a donation.', 'error');
      } else {
        showToast('Failed to process donation. Please try again.', 'error');
      }
    })
    .finally(() => {
      setDonationLoading(false);
    });
  };

  const showToast = (message, type = 'info') => {
    // Create toast element
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });
  };

  const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filterCampaigns = () => {
    if (!searchDate) {
      setFilteredCampaigns(campaigns);
      return;
    }

    const filtered = campaigns.filter(campaign => {
      const campaignStartDate = new Date(campaign.start_date);
      const searchDateObj = new Date(searchDate);
      
      // Compare only the date part (year, month, day)
      return campaignStartDate.toDateString() === searchDateObj.toDateString();
    });

    setFilteredCampaigns(filtered);
  };

  const clearSearch = () => {
    setSearchDate('');
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Campaigns</h2>
        <span className="badge bg-primary fs-6">
          {filteredCampaigns.length} Campaign{filteredCampaigns.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                placeholder="Search by start date..."
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
              {searchDate && (
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={clearSearch}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            {searchDate && (
              <small className="text-muted mt-1 d-block">
                Showing campaigns starting on {formatDate(searchDate)}
              </small>
            )}
          </div>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">
            {searchDate ? 'No campaigns found for the selected date' : 'No campaigns found'}
          </h4>
          <p className="text-muted">
            {searchDate ? 'Try selecting a different date or clear the search.' : 'Be the first to create a campaign!'}
          </p>
          {searchDate && (
            <button className="btn btn-outline-primary mt-2" onClick={clearSearch}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-primary mb-2">
                    {campaign.title}
                  </h5>
                  
                  <p className="card-text text-muted mb-3 flex-grow-1">
                    {campaign.description && campaign.description.length > 150 
                      ? `${campaign.description.substring(0, 150)}...` 
                      : campaign.description}
                  </p>

                  <div className="mb-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted d-block">Start Date</small>
                        <strong>{formatDate(campaign.start_date)}</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">End Date</small>
                        <strong>{formatDate(campaign.end_date)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">Progress</small>
                      <small className="text-muted">{campaign.progress_percentage || 0}%</small>
                    </div>
                    <div className="progress mb-2" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${campaign.progress_percentage || 0}%` }}
                        aria-valuenow={campaign.progress_percentage || 0} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Raised</small>
                      <strong className="text-success">
                        {formatCurrency(campaign.total_donations || 0)}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Target</small>
                      <strong className="text-primary">
                        {formatCurrency(campaign.target_amount)}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-success btn-sm mb-2"
                        onClick={() => handleDonate(campaign.id)}
                      >
                        💰 Donate
                      </button>
                      
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">💝 Make a Donation</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDonationModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6 className="text-primary">{selectedCampaign.title}</h6>
                  <p className="text-muted small mb-3">
                    {selectedCampaign.description && selectedCampaign.description.length > 100 
                      ? `${selectedCampaign.description.substring(0, 100)}...` 
                      : selectedCampaign.description}
                  </p>
                </div>
                <div className="mb-3">
                  <label htmlFor="donationAmount" className="form-label">Donation Amount ($)</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="donationAmount"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-text">
                    Minimum donation: $1.00
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDonationModal(false)}
                  disabled={donationLoading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={submitDonation}
                  disabled={donationLoading || !donationAmount || parseFloat(donationAmount) <= 0}
                >
                  {donationLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : (
                    '💝 Donate Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showDonationModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default CampaignList;
