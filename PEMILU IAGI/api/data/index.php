<?php
http_response_code(403);
header('Content-Type: application/json; charset=UTF-8');
exit(json_encode(['success' => false, 'error' => '403 Forbidden - Direct database access denied']));
