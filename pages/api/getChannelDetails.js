import fetch from 'cross-fetch';

// Fetch channel details
const fetchChannelDetails = async () => {
    try {
        const response = await fetch('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels');
        const data = await response.json();
        console.log('Channel Details Data:', data); // Log to inspect
        return data.channels || [];
    } catch (error) {
        console.error('Error fetching channel details:', error);
        return [];
    }
};

// API handler
export default async function handler(req, res) {
    try {
        const channels = await fetchChannelDetails();

        // Log to inspect
        console.log('Channels:', channels);

        const channelId = req.query.id;

        if (!channelId) {
            return res.status(400).json({ error: 'Channel ID is required' });
        }

        const channel = channels.find(channel => channel.id.toString() === channelId.toString());
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        res.status(200).json({ channel });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
