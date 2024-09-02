import fetch from 'cross-fetch';

// Fetch channel details from the first API
const fetchChannelDetails = async () => {
    try {
        const response = await fetch('https://tplayapi.code-crafters.app/321codecrafters/fetcher.json');
        const data = await response.json();
        return data.data.channels.flat(); // Flatten channels array
    } catch (error) {
        console.error('Error fetching channel details:', error);
        return [];
    }
};

// Fetch license keys from your API
const fetchLicenseKeys = async () => {
    try {
        const response = await fetch('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels');
        const data = await response.json();
        return data; // Example: { "channel1_id": "key1", "channel2_id": "key2", ... }
    } catch (error) {
        console.error('Error fetching license keys:', error);
        return {};
    }
};

// Combine channel details with license keys and send the response
export default async function handler(req, res) {
    try {
        const channels = await fetchChannelDetails();
        const licenseKeys = await fetchLicenseKeys();

        const enrichedChannels = channels.map(channel => ({
            ...channel,
            license_key: licenseKeys[channel.id] || null // Add the license key
        }));

        res.status(200).json({ list: enrichedChannels });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
