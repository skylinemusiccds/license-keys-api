import fetch from 'cross-fetch';

// Fetch channel details from the provided API
const fetchChannelDetails = async () => {
    try {
        const response = await fetch('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels');
        const data = await response.json();
        return data.channels || []; // Ensure a default empty array
    } catch (error) {
        console.error('Error fetching channel details:', error);
        return [];
    }
};

// Fetch dynamic license keys from your API
const fetchDynamicLicenseKeys = async () => {
    try {
        const response = await fetch('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels');
        const data = await response.json();
        return data; // Adjust according to your actual license keys API response
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
        const channelId = req.query.id;

        if (!channelId) {
            return res.status(400).json({ error: 'Channel ID is required' });
        }

        // Find the specific channel by ID
        const channel = channels.find(channel => channel.id === channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const license = licenseKeys[channelId] || {};
        const key = license.keys ? license.keys[0]?.k : null;

        const enrichedChannel = {
            ...channel,
            license_key: key || null,
            license_key_type: license.type || null
        };

        res.status(200).json({ channel: enrichedChannel });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
