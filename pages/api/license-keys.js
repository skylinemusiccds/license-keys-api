// Example: Serve static license keys or fetch from a database
export default function handler(req, res) {
    const licenseKeys = {
        "channel1_id": "key1",
        "channel2_id": "key2",
        // Add more channels and their keys here
    };

    res.status(200).json(licenseKeys);
}
