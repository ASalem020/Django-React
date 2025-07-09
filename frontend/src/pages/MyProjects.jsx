import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../apis/config';
import { Box, Typography, Card, CardContent, CardMedia, Button, LinearProgress, Grid } from '@mui/material';

export default function MyProjects() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const response = await axios.get('/api/campaigns/mine/');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCampaigns();
  }, []);

  if (loading) return <Typography>Loading your campaigns...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Campaigns</Typography>
      
      {campaigns.length === 0 ? (
        <Typography>You haven't created any campaigns yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item xs={12} sm={6} md={4} key={campaign.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={campaign.image || "https://picsum.photos/300/180"}
                  alt={campaign.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5">{campaign.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {campaign.description}
                  </Typography>
                  
                  <LinearProgress
                    variant="determinate"
                    value={campaign.progress_percentage}
                    sx={{ height: 10, mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/edit-campaign/${campaign.id}`)}
                    >
                      Edit
                    </Button>
                    <Button fullWidth variant="contained" color="error">
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}