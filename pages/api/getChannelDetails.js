// pages/api/fetchChannels.js

export default async function handler(req, res) {
    const apiUrl = 'https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const channels = await response.json('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels');

        const channelData = channels.map(channel => ({
            id: channel.id,
            name: channel.name,
            tvg_id: channel.tvg_id,
            group_title: channel.firstGenre,
            tvg_logo: channel.logo_url,
            stream_url: channel.manifest_url,
            license_url: channel.license_url,
            stream_headers: channel.manifest_headers ? (channel.manifest_headers['User-Agent'] || JSON.stringify(channel.manifest_headers)) : null,
            drm: channel.drm,
            is_mpd: channel.is_mpd,
            kid_in_mpd: channel.kid_in_mpd,
            key_extracted: channel.key_extracted,
            pssh: channel.pssh,
            clearkey: channel.clearkeys ? JSON.stringify(channel.clearkeys[0].base64) : null
        }));

        res.status(200).json(channelData);
    } catch (error) {
        console.error('Error fetching channel data:', error);
        res.status(500).json({ error: 'Failed to fetch channel data' });
    }
}
