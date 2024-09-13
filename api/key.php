<?php

// Include necessary configurations (e.g., user agent, API keys, etc.)
include 'config.php'; 
error_reporting(0);
ini_set('display_errors', 0);

// Get channel ID from the URL, e.g., key.php?id=1003
$id = $_GET['id'] ?? exit('No ID provided.');

// Fetch channel info (You need to implement this based on your data structure)
$channelInfo = getChannelInfo($id);
$dashUrl = $channelInfo['streamData']['initialUrl'] ?? exit('No stream URL found for the channel.');

// Fetch the manifest (MPD) file from the DASH URL
$manifestContent = fetchMPDManifest($dashUrl, $userAgent) ?? exit('Failed to fetch MPD manifest.');

// Extract Widevine PSSH and KID from the manifest
$widevinePssh = extractPsshFromManifest($manifestContent);

if (!$widevinePssh) {
    exit("Error: Could not extract PSSH or KID.");
}

$pssh = $widevinePssh['pssh']; // PSSH value
$kid = $widevinePssh['kid'];   // KID value

// Fetch the license key from the license server
$licenseKey = fetchLicenseKey($pssh);

if (!$licenseKey) {
    exit("Error: Could not fetch the license key.");
}

// Output the license key as a response (you can modify this as needed)
header('Content-Type: application/json');
echo json_encode([
    'license_key' => base64_encode($licenseKey), // Base64-encoded key
    'kid' => $kid
]);

// Function to fetch the MPD manifest (this will need to be adjusted based on your use case)
function fetchMPDManifest($dashUrl, $userAgent) {
    // cURL request to get the MPD manifest
    $ch = curl_init($dashUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
    $manifestContent = curl_exec($ch);
    
    if (curl_errno($ch)) {
        curl_close($ch);
        return false;
    }

    curl_close($ch);
    return $manifestContent;
}

// Function to extract PSSH and KID from the manifest
function extractPsshFromManifest($manifestContent) {
    // Regex to find the PSSH and KID
    $psshPattern = '/<cenc:pssh>(.*?)<\/cenc:pssh>/';
    $kidPattern = '/<ContentProtection.*?cenc:default_KID="([0-9a-fA-F]{32})".*?>/';

    // Extract PSSH
    if (preg_match($psshPattern, $manifestContent, $psshMatches)) {
        $pssh = $psshMatches[1];
    } else {
        return false; // No PSSH found
    }

    // Extract KID
    if (preg_match($kidPattern, $manifestContent, $kidMatches)) {
        $kid = $kidMatches[1];
    } else {
        return false; // No KID found
    }

    return [
        'pssh' => $pssh,
        'kid' => $kid
    ];
}

// Function to fetch the license key from the Widevine license server
function fetchLicenseKey($pssh) {
    $licenseServerUrl = "https://raw.githubusercontent.com/Babel-In/TP-IN/main/jup.json"; // Replace with actual license server URL
    $headers = [
        'Content-Type: application/octet-stream',
        'Accept: application/json',
    ];

    // Decode PSSH from base64 (if needed)
    $postData = base64_decode($pssh);

    // Initialize cURL
    $ch = curl_init($licenseServerUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

    // Execute the request
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        curl_close($ch);
        return false;
    }

    curl_close($ch);

    // Assuming the response contains the license key (in binary or base64 format)
    return $response;
}

?>
