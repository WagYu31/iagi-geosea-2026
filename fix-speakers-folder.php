<?php

// Create speakers folder if not exists
$speakersDir = __DIR__ . '/public/storage/speakers';

if (!is_dir($speakersDir)) {
    mkdir($speakersDir, 0777, true);
    echo "✅ Folder 'public/storage/speakers' created successfully!\n";
} else {
    echo "✅ Folder 'public/storage/speakers' already exists.\n";
}

// Set permissions
chmod($speakersDir, 0777);
echo "✅ Permissions set to 777 (read, write, execute for all).\n";

// Test if writable
if (is_writable($speakersDir)) {
    echo "✅ Folder is writable!\n";

    // Create test file
    $testFile = $speakersDir . '/test.txt';
    file_put_contents($testFile, 'Test write');

    if (file_exists($testFile)) {
        echo "✅ Write test successful!\n";
        unlink($testFile);
        echo "✅ Test file deleted.\n";
    } else {
        echo "❌ Write test failed!\n";
    }
} else {
    echo "❌ Folder is NOT writable! Please check permissions.\n";
}

echo "\nFolder path: $speakersDir\n";
echo "Photo upload should now work!\n";
