<?php
/**
 * Configuration for CORS Headers & Helper Functions
 * SMK Nusa Bangsa Backend API
 */

// Allow cross-origin requests from frontend React client
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle HTTP OPTIONS Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Standard JSON Response Sender
 */
function sendJsonResponse($statusCode, $message, $data = null, $extra = []) {
    http_response_code($statusCode);
    
    $response = array_merge([
        'status' => $statusCode >= 200 && $statusCode < 300 ? 'success' : 'error',
        'code' => $statusCode,
        'message' => $message,
        'data' => $data
    ], $extra);

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

/**
 * Get Request JSON Input Body
 */
function getJsonInput() {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);
    return is_array($data) ? $data : $_POST;
}
