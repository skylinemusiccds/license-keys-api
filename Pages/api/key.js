export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Invalid channel ID' });
    return;
  }

  const apiUrl = `https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching license keys' });
  }
}
