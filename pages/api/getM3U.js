export default async function handler(req, res) {
    // Replace with your API endpoint
    const apiEndpoint = 'https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels';

    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        // Convert JSON to M3U format for all channels
        const m3uContent = convertJsonToM3U(data.channels); // assuming "channels" is the key containing the list of channels

        // Set headers to indicate it's an M3U file
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.status(200).send(m3uContent);
    } catch (error) {
        console.error('Error fetching API data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

function convertJsonToM3U(channels) {
    let m3u = "#EXTM3U\n";

    channels.forEach(channel => {
        const channelUrl = channel.channel_url;
        const key = channel.keys[0].k;
        const kid = channel.keys[0].kid;
        const channelName = channel.name || "Channel";

        m3u += `
#EXTINF:-1, ${channelName}
#KODIPROP:inputstream.adaptive.license_type=clearkey
#KODIPROP:inputstream.adaptive.license_key=${kid}:${key}
${channelUrl}\n`;
    });

    return m3u;
}
