// pages/api/fetchChannels.js

export default async function handler(req, res) {
    const apiUrl = 'https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels';

    try {
        const response = await fetch('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels'); {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const channels = await response.json();

        // Map the channel data to the desired format
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

        // Generate the M3U string
        let m3uStr = "#EXTM3U\n\n";

        channelData.forEach(channel => {
            m3uStr += '#EXTINF:-1 tvg-id="' + channel.id.toString() + '" ';
            m3uStr += 'group-title="' + (channel.group_title || '') + '", ';
            m3uStr += 'tvg-logo="https://mediaready.videoready.tv/tatasky-epg/image/fetch/f_auto,fl_lossy,q_auto,h_250,w_250/' + (channel.tvg_logo || '') + '", ';
            m3uStr += channel.name + '\n';
            m3uStr += '#KODIPROP:inputstream.adaptive.license_type=clearkey\n';
            m3uStr += '#KODIPROP:inputstream.adaptive.license_key=' + (channel.clearkey || '') + '\n';
            m3uStr += '#EXTVLCOPT:http-user-agent=' + (channel.stream_headers || '') + '\n';
            m3uStr += channel.stream_url + '\n\n';
        });

        // Set the response type to plain text for M3U
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(m3uStr);
    } catch (error) {
        console.error('Error fetching channel data:', error);
        res.status(500).json({ error: 'Failed to fetch channel data' });
    }
}
