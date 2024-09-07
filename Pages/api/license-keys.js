// pages/api/license-keys.js

export default async function handler(req, res) {
    try {
        const response = await fetch('https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels');
        const data = await response.json();

        // Example processing based on the expected structure
        const processedKeys = data.keys.map(key => ({
            keyId: key.kid,
            key: key.k
        }));

        res.status(200).json({ keys: processedKeys });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching license keys' });
    }
}
