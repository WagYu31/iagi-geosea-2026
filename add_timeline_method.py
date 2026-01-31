import re

# Read the file
file_path = r'c:\laragon\www\iagi-geosea-2026\app\Http\Controllers\LandingPageSettingController.php'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the position before formatBytes method
pattern = r'(\s+/\*\*\s+\* Helper function to format file size\s+\*/)'
match = re.search(pattern, content)

if match:
    insertion_point = match.start()
    new_method = """
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

            $setting = LandingPageSetting::where('key', 'conference_timeline')->first();

            // Save to database
            if ($setting) {
                $setting->update(['value' => json_encode($request->timeline)]);
            } else {
                LandingPageSetting::create([
                    'key' => 'conference_timeline',
                    'value' => json_encode($request->timeline),
                    'type' => 'json',
                ]);
            }

            \\Log::info('Conference timeline saved successfully');

            return response()->json([
                'success' => true,
                'timeline' => $request->timeline,
                'message' => 'Timeline saved successfully'
            ]);

        } catch (\\Exception $e) {
            \\Log::error('Save timeline error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Save failed: ' . $e->getMessage()
            ], 500);
        }
    }

"""
    
    new_content = content[:insertion_point] + new_method + content[insertion_point:]
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully added saveTimeline method!")
else:
    print("Could not find formatBytes method!")
