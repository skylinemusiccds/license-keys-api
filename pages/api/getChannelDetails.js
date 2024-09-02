import fetch from 'cross-fetch';

// Fetch channel details from the provided API
const fetchChannelDetails = async () => {
    try {
        const response = await fetch('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels');
        const data = await response.json();
        return data.channels ? data.channels : []; // Adjust according to the actual response structure
    } catch (error) {
        console.error('Error fetching channel details:', error);
        return [];
    }
};

// Fetch dynamic license keys from your API
const fetchDynamicLicenseKeys = async () => {
    try {
        const response = await fetch('https://license-keys-api.vercel.app/api/license-keys');
        const data = await response.json();
        return data; // Example: { "channel1_id": { "keys": [...], "type": "temporary" }, ... }
    } catch (error) {
        console.error('Error fetching license keys:', error);
        return {};
    }
};

// Combine channel details with license keys and send the response
export default async function handler(req, res) {
    try {
        const channels = await fetchChannelDetails();
        const licenseKeys = await fetchDynamicLicenseKeys();

        // Extract channel ID from query parameters
        const channelId = req.query.id; // Example: id=channel1_id

        if (!channelId) {
            return res.status(400).json({ error: 'Channel ID is required' });
        }

        // Find the specific channel by ID
        const channel = channel
        
