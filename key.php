<?php
// Replace this with your actual API URL
$apiUrl = 'https://babel-in.xyz/babel-b2ef9ad8f0d432962d47009b24dee465/tata/channels';

// Get channel ID from the query string
$channelId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($channelId <= 0) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Invalid channel ID']);
    exit;
}

// Fetch license keys from API
$response = file_get_contents($apiUrl);

if ($response === FALSE) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Error fetching license keys']);
    exit;
}

$data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Error decoding JSON']);
    exit;
}

// Extract and filter license keys based on channel ID
$licenseKeys = isset($data['keys']) ? $data['keys'] : [];
$filteredKeys = array_filter($licenseKeys, function ($key) use ($channelId) {
    // Check if the 'channel_id' key exists and matches the requested channel ID
    return isset($key['channel_id']) && $key['channel_id'] == $channelId;
});

// Check if any keys were found
if (empty($filteredKeys)) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => 'No keys found for the specified channel ID']);
    exit;
}

header('Content-Type: application/json');
echo json_encode(['keys' => array_values($filteredKeys), 'type' => 'temporary']);
?>
