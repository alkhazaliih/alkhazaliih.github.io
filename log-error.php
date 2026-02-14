<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// قراءة البيانات القادمة من الصفحة
$data = file_get_contents('php://input');
$log = json_decode($data, true);

if (!$log) {
    http_response_code(400);
    exit;
}

/* =========================
   جلب IP الحقيقي للزائر
========================= */
function getUserIP() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP']; // Cloudflare
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
}

$log['ip'] = getUserIP();
$log['logged_at'] = date('c'); // ISO 8601

/* =========================
   إنشاء مجلد logs إذا مش موجود
========================= */
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

/* =========================
   اسم الملف
========================= */
$fileName = sprintf(
    'error-%s-%s.json',
    $log['code'] ?? 'unknown',
    $log['trace'] ?? uniqid()
);

/* =========================
   حفظ الملف
========================= */
file_put_contents(
    $logDir . '/' . $fileName,
    json_encode($log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
);

http_response_code(200);
echo json_encode(['status' => 'logged']);
