<?php
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$submissions = \App\Models\Submission::latest()->take(5)->get(['id', 'status', 'title']);
foreach ($submissions as $s) {
    echo "ID: {$s->id} | status: [{$s->status}] | title: [{$s->title}]\n";
}
