<?php

namespace App\Http\Controllers;

use App\Models\LandingPageSetting;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LandingPageSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = LandingPageSetting::all()->groupBy('section');
        
        $submissionSettings = [
            'submission_deadline_start' => Setting::get('submission_deadline_start'),
            'submission_deadline_end' => Setting::get('submission_deadline_end'),
            'submission_enabled' => Setting::get('submission_enabled', '1'),
        ];

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
            'submissionSettings' => $submissionSettings,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $setting)
    {
        $validated = $request->validate([
            'value' => 'nullable',
        ]);
        
        // Handle empty value - save as empty string
        $validated['value'] = $validated['value'] ?? '';

        // Find by key or id
        $settingModel = LandingPageSetting::where('key', $setting)->first();
        
        if (!$settingModel) {
            // Try to find by ID
            $settingModel = LandingPageSetting::find($setting);
        }

        if (!$settingModel) {
            // Create new setting with this key
            $settingModel = LandingPageSetting::create([
                'key' => $setting,
                'value' => $validated['value'],
                'section' => 'landing_page',
                'type' => 'json',
            ]);
            Log::info('Created new setting: ' . $setting);
        } else {
            $settingModel->update($validated);
            Log::info('Updated setting: ' . $setting);
        }

        return redirect()->back()->with('success', 'Setting updated successfully');
    }

    /**
     * Store a new setting
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:landing_page_settings,key',
            'value' => 'nullable',
            'group' => 'nullable|string',
            'type' => 'nullable|string',
        ]);
        
        // Handle empty value
        $value = $validated['value'] ?? '';

        LandingPageSetting::create([
            'key' => $validated['key'],
            'value' => $value,
            'section' => $validated['group'] ?? 'general',
            'type' => $validated['type'] ?? 'text',
        ]);

        return redirect()->back()->with('success', 'Setting created successfully');
    }

    /**
     * Upload speaker photo
     */
    public function uploadSpeakerPhoto(Request $request)
    {
        try {
            $request->validate([
                'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'index' => 'required|integer'
            ]);

            $setting = LandingPageSetting::where('key', 'keynote_speakers')->first();

            if (!$setting) {
                \Log::error('Keynote speakers setting not found');
                return response()->json(['error' => 'Setting not found'], 404);
            }

            $speakers = json_decode($setting->value, true);
            $index = $request->index;

            if (!isset($speakers[$index])) {
                \Log::error('Speaker not found at index: ' . $index);
                return response()->json(['error' => 'Speaker not found at index ' . $index], 404);
            }

            // Ensure directory exists
            $uploadPath = public_path('storage/speakers');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // Delete old photo if exists
            if (isset($speakers[$index]['photo']) && $speakers[$index]['photo']) {
                $oldPhotoPath = public_path($speakers[$index]['photo']);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                    \Log::info('Deleted old photo: ' . $oldPhotoPath);
                }
            }

            // Upload new photo
            $file = $request->file('photo');
            $filename = time() . '_' . $index . '.' . $file->getClientOriginalExtension();

            $file->move($uploadPath, $filename);
            \Log::info('Photo uploaded: ' . $filename);

            // Update speaker photo path
            $speakers[$index]['photo'] = '/storage/speakers/' . $filename;

            // Save to database
            $setting->update(['value' => json_encode($speakers)]);
            \Log::info('Database updated with new photo path');

            return response()->json([
                'success' => true,
                'photo_url' => $speakers[$index]['photo'],
                'message' => 'Photo uploaded successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Photo upload error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload sponsor logo
     */
    public function uploadSponsorLogo(Request $request)
    {
        try {
            $request->validate([
                'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'index' => 'required|integer'
            ]);

            $setting = LandingPageSetting::where('key', 'sponsors')->first();

            if (!$setting) {
                Log::error('Sponsors setting not found');
                return response()->json(['error' => 'Setting not found'], 404);
            }

            $sponsors = json_decode($setting->value, true);
            $index = $request->index;

            if (!isset($sponsors[$index])) {
                Log::error('Sponsor not found at index: ' . $index);
                return response()->json(['error' => 'Sponsor not found at index ' . $index], 404);
            }

            // Ensure directory exists
            $uploadPath = public_path('storage/sponsors');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // Delete old logo if exists
            if (isset($sponsors[$index]['logo']) && $sponsors[$index]['logo']) {
                $oldLogoPath = public_path($sponsors[$index]['logo']);
                if (file_exists($oldLogoPath)) {
                    unlink($oldLogoPath);
                    Log::info('Deleted old logo: ' . $oldLogoPath);
                }
            }

            // Upload new logo
            $file = $request->file('logo');
            $filename = time() . '_' . $index . '.' . $file->getClientOriginalExtension();

            $file->move($uploadPath, $filename);
            Log::info('Logo uploaded: ' . $filename);

            // Update sponsor logo path
            $sponsors[$index]['logo'] = '/storage/sponsors/' . $filename;

            // Save to database
            $setting->update(['value' => json_encode($sponsors)]);
            Log::info('Database updated with new logo path');

            return response()->json([
                'success' => true,
                'logo_url' => $sponsors[$index]['logo'],
                'message' => 'Logo uploaded successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Logo upload error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download resource file
     */
    public function downloadResource($index)
    {
        try {
            $setting = LandingPageSetting::where('key', 'resources')->first();

            if (!$setting) {
                abort(404, 'Resources not found');
            }

            $resources = json_decode($setting->value, true);

            if (!isset($resources[$index])) {
                abort(404, 'Resource not found');
            }

            $resource = $resources[$index];
            $filePath = public_path($resource['file']);

            if (!file_exists($filePath)) {
                abort(404, 'File not found');
            }

            // Determine MIME type based on extension
            $extension = strtolower($resource['type']);
            $mimeTypes = [
                'pdf' => 'application/pdf',
                'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'ppt' => 'application/vnd.ms-powerpoint',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'doc' => 'application/msword',
                'txt' => 'text/plain',
            ];

            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';

            // Get original filename
            $filename = basename($resource['file']);

            // Create a better filename based on title
            $title = str_replace(' ', '-', strtolower($resource['title']));
            $downloadFilename = $title . '.' . $extension;

            return response()->download($filePath, $downloadFilename, [
                'Content-Type' => $mimeType,
            ]);

        } catch (\Exception $e) {
            Log::error('Download error: ' . $e->getMessage());
            abort(500, 'Download failed');
        }
    }

    /**
     * Get settings for public landing page
     */
    public function getPublicSettings()
    {
        $settings = LandingPageSetting::all();

        $formatted = [];
        foreach ($settings as $setting) {
            if ($setting->type === 'json') {
                $formatted[$setting->key] = json_decode($setting->value, true);
            } else {
                $formatted[$setting->key] = $setting->value;
            }
        }

        return response()->json($formatted);
    }

    /**
     * Upload resource file (PDF, PPT, Word, TXT, images)
     */
    public function uploadResourceFile(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,txt,jpg,jpeg,png,gif|max:10240', // 10MB max
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'resource_index' => 'nullable|integer|min:0', // Support unlimited resources
            ]);

            $setting = LandingPageSetting::where('key', 'resources')->first();

            // Initialize resources array if not exists
            $resources = $setting ? json_decode($setting->value, true) : [];
            if (!is_array($resources)) {
                $resources = [];
            }

            // Ensure we have at least 3 slots for fixed resources
            while (count($resources) < 3) {
                $resources[] = [];
            }

            // Ensure directory exists
            $uploadPath = public_path('storage/resources');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // Get file object and info BEFORE moving
            $file = $request->file('file');
            $fileType = $file->getClientOriginalExtension();
            $fileSize = $this->formatBytes($file->getSize());
            
            // Upload file
            $filename = time() . '_' . uniqid() . '.' . $fileType;
            $file->move($uploadPath, $filename);

            \Log::info('Resource file uploaded: ' . $filename);

            // Get file URL
            $fileUrl = '/storage/resources/' . $filename;

            // Create resource object
            $newResource = [
                'title' => $request->title,
                'description' => $request->description ?? '',
                'file_url' => $fileUrl,
                'file_type' => $fileType,
                'file_size' => $fileSize,
            ];

            // Update specific index or append
            $resourceIndex = $request->resource_index;
            if ($resourceIndex !== null && $resourceIndex >= 0) {
                // Ensure array has enough slots
                while (count($resources) <= $resourceIndex) {
                    $resources[] = ['title' => '', 'description' => ''];
                }
                // Update specific slot
                $resources[$resourceIndex] = $newResource;
                \Log::info('Updated resource at index: ' . $resourceIndex);
            } else {
                // Append new resource
                $resources[] = $newResource;
                \Log::info('Appended new resource');
            }

            // Save or create setting
            if ($setting) {
                $setting->update(['value' => json_encode($resources)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'resources',
                    'value' => json_encode($resources),
                    'type' => 'json',
                ]);
            }

            \Log::info('Resources updated in database');

            return response()->json([
                'success' => true,
                'resource' => $newResource,
                'message' => 'Resource file uploaded successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Resource upload error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save all resources (metadata only, no file upload required)
     */
    public function saveResources(Request $request)
    {
        try {
            $request->validate([
                'resources' => 'required|array',
                'resources.*.title' => 'nullable|string|max:255',
                'resources.*.description' => 'nullable|string',
            ]);

            $setting = LandingPageSetting::where('key', 'resources')->first();
            
            // Get current resources from DB to preserve file data
            $currentResources = $setting ? json_decode($setting->value, true) : [];
            if (!is_array($currentResources)) {
                $currentResources = [];
            }

            // Merge incoming metadata with existing file data
            $resources = $request->resources;
            foreach ($resources as $index => $resource) {
                // Preserve existing file_url, file_type, file_size if they exist
                if (isset($currentResources[$index])) {
                    $resources[$index] = array_merge($currentResources[$index], $resource);
                }
            }

            // Save to database
            if ($setting) {
                $setting->update(['value' => json_encode($resources)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'resources',
                    'value' => json_encode($resources),
                    'type' => 'json',
                ]);
            }

            \Log::info('Resources metadata saved successfully');

            return response()->json([
                'success' => true,
                'resources' => $resources,
                'message' => 'Resources saved successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Save resources error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Save failed: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Save conference timeline
     */
    public function saveTimeline(Request $request)
    {
        try {
            $request->validate([
                'timeline' => 'required|array',
                'timeline.*.title' => 'required|string|max:255',
                'timeline.*.date' => 'required|string|max:100',
                'timeline.*.status' => 'required|in:active,upcoming,completed',
            ]);

            $setting = LandingPageSetting::where('key', 'timeline')->first();

            // Save to database
            if ($setting) {
                $setting->update(['value' => json_encode($request->timeline)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'timeline',
                    'value' => json_encode($request->timeline),
                    'type' => 'json',
                ]);
            }

            \Log::info('Conference timeline saved successfully');

            return response()->json([
                'success' => true,
                'timeline' => $request->timeline,
                'message' => 'Timeline saved successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Save timeline error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Save failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload hero background (video or image)
     */
    public function uploadHeroBackground(Request $request)
    {
        try {
            $request->validate([
                'hero_background' => 'required|file|mimes:mp4,webm,jpg,jpeg,png,gif|max:51200', // 50MB max
            ]);

            // Ensure directory exists
            $uploadPath = public_path('storage/hero');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // Get or create hero_background setting
            $setting = LandingPageSetting::where('key', 'hero_background')->first();
            
            // Delete old file if exists
            if ($setting && $setting->value) {
                $oldData = json_decode($setting->value, true);
                if (isset($oldData['url'])) {
                    $oldPath = public_path($oldData['url']);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                        Log::info('Deleted old hero background: ' . $oldPath);
                    }
                }
            }

            // Upload new file
            $file = $request->file('hero_background');
            $extension = $file->getClientOriginalExtension();
            $filename = 'hero_bg_' . time() . '.' . $extension;
            $file->move($uploadPath, $filename);

            Log::info('Hero background uploaded: ' . $filename);

            // Determine type (video or image)
            $videoExtensions = ['mp4', 'webm'];
            $type = in_array(strtolower($extension), $videoExtensions) ? 'video' : 'image';

            // Save to database
            $heroData = [
                'url' => '/storage/hero/' . $filename,
                'type' => $type,
                'filename' => $filename,
            ];

            if ($setting) {
                $setting->update(['value' => json_encode($heroData)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'hero_background',
                    'value' => json_encode($heroData),
                    'section' => 'landing_page',
                    'type' => 'json',
                ]);
            }

            Log::info('Hero background saved to database');

            return response()->json([
                'success' => true,
                'hero_background' => $heroData,
                'message' => 'Hero background uploaded successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Hero background upload error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save hero text settings
     */
    public function saveHeroText(Request $request)
    {
        try {
            $request->validate([
                'hero_text' => 'required|array',
                'hero_text.title_line1' => 'required|string|max:255',
                'hero_text.title_line2' => 'required|string|max:255',
                'hero_text.theme_label' => 'required|string|max:255',
                'hero_text.theme_text' => 'required|string|max:500',
            ]);

            $setting = LandingPageSetting::where('key', 'hero_text')->first();

            // Save to database
            if ($setting) {
                $setting->update(['value' => json_encode($request->hero_text)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'hero_text',
                    'value' => json_encode($request->hero_text),
                    'section' => 'landing_page',
                    'type' => 'json',
                ]);
            }

            Log::info('Hero text saved successfully');

            return response()->json([
                'success' => true,
                'hero_text' => $request->hero_text,
                'message' => 'Hero text saved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Save hero text error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Save failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload hero logo (center logo in hero section)
     */
    public function uploadHeroLogo(Request $request)
    {
        try {
            $request->validate([
                'hero_logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120', // 5MB max
            ]);

            // Ensure directory exists
            $uploadPath = public_path('storage/hero');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // Get or create hero_logo setting
            $setting = LandingPageSetting::where('key', 'hero_logo')->first();
            
            // Delete old file if exists
            if ($setting && $setting->value) {
                $oldData = json_decode($setting->value, true);
                if (isset($oldData['url'])) {
                    $oldPath = public_path($oldData['url']);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                        Log::info('Deleted old hero logo: ' . $oldPath);
                    }
                }
            }

            // Upload new file
            $file = $request->file('hero_logo');
            $extension = $file->getClientOriginalExtension();
            $filename = 'hero_logo_' . time() . '.' . $extension;
            $file->move($uploadPath, $filename);

            Log::info('Hero logo uploaded: ' . $filename);

            // Save to database
            $logoData = [
                'url' => '/storage/hero/' . $filename,
                'filename' => $filename,
            ];

            if ($setting) {
                $setting->update(['value' => json_encode($logoData)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'hero_logo',
                    'value' => json_encode($logoData),
                    'section' => 'landing_page',
                    'type' => 'json',
                ]);
            }

            Log::info('Hero logo saved to database');

            return response()->json([
                'success' => true,
                'hero_logo' => $logoData,
                'message' => 'Hero logo uploaded successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Hero logo upload error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload secondary hero logo (add to array of logos)
     */
    public function uploadHeroLogoSecondary(Request $request)
    {
        try {
            $request->validate([
                'hero_logo_secondary' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            ]);

            $uploadPath = public_path('storage/hero');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // Get existing logos array
            $setting = LandingPageSetting::where('key', 'hero_logos_secondary')->first();
            $logos = [];
            if ($setting && $setting->value) {
                $logos = json_decode($setting->value, true);
                if (!is_array($logos)) $logos = [];
            }

            // Upload new file
            $file = $request->file('hero_logo_secondary');
            $extension = $file->getClientOriginalExtension();
            $filename = 'hero_logo_secondary_' . time() . '_' . count($logos) . '.' . $extension;
            $file->move($uploadPath, $filename);

            // Add new logo to array
            $logos[] = [
                'url' => '/storage/hero/' . $filename,
                'filename' => $filename,
            ];

            // Save to database
            if ($setting) {
                $setting->update(['value' => json_encode($logos)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'hero_logos_secondary',
                    'value' => json_encode($logos),
                    'section' => 'landing_page',
                    'type' => 'json',
                ]);
            }

            return response()->json([
                'success' => true,
                'hero_logos_secondary' => $logos,
                'message' => 'Secondary logo added successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Secondary logo upload error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete secondary hero logo by index
     */
    public function deleteHeroLogoSecondary(Request $request)
    {
        try {
            $request->validate([
                'index' => 'required|integer|min:0',
            ]);

            $index = $request->index;
            $setting = LandingPageSetting::where('key', 'hero_logos_secondary')->first();
            
            if (!$setting || !$setting->value) {
                return response()->json(['error' => 'No secondary logos found'], 404);
            }

            $logos = json_decode($setting->value, true);
            
            if (!isset($logos[$index])) {
                return response()->json(['error' => 'Logo not found at index ' . $index], 404);
            }

            // Delete file
            $logoPath = public_path($logos[$index]['url']);
            if (file_exists($logoPath)) {
                unlink($logoPath);
            }

            // Remove from array
            array_splice($logos, $index, 1);

            // Update database
            $setting->update(['value' => json_encode($logos)]);

            return response()->json([
                'success' => true,
                'hero_logos_secondary' => $logos,
                'message' => 'Secondary logo deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete secondary logo error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }



    /**
     * Helper function to format file size
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
