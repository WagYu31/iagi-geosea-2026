import re

# Read the file
file_path = r'c:\laragon\www\iagi-geosea-2026\resources\js\Pages\Admin\Settings.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add timeline state initialization (after resources state)
# Find the resources state line
resources_pattern = r"(const \[resources, setResources\] = useState\(props\.settings\.resources \|\| \[\]\);)"
match = re.search(resources_pattern, content)

if match:
    insertion_point = match.end()
    timeline_state = "\n    const [timeline, setTimeline] = useState(props.settings.conference_timeline || []);"
    content = content[:insertion_point] + timeline_state + content[insertion_point:]
    print("✅ Added timeline state initialization")
else:
    print("❌ Could not find resources state")

# 2. Add handleTimelineDelete handler (after handleSaveResources)
delete_pattern = r"(    // Handle save resources.*?\n    };)"
match = re.search(delete_pattern, content, re.DOTALL)

if match:
    insertion_point = match.end()
    delete_handler = """

    // Handle timeline delete
    const handleTimelineDelete = (index) => {
        if (confirm('Are you sure you want to delete this timeline event?')) {
            const newTimeline = timeline.filter((_, i) => i !== index);
            setTimeline(newTimeline);
        }
    };

    // Handle save timeline
    const handleSaveTimeline = async () => {
        try {
            const response = await axios.post(route('admin.settings.saveTimeline'), {
                timeline: timeline
            });

            if (response.data.success) {
                setTimeline(response.data.timeline);
                router.reload({ preserveScroll: true });
                alert('Timeline saved successfully!');
            }
        } catch (error) {
            console.error('Save timeline error:', error);
            alert('Failed to save timeline: ' + (error.response?.data?.error || error.message));
        }
    };"""
    
    content = content[:insertion_point] + delete_handler + content[insertion_point:]
    print("✅ Added timeline handlers")
else:
    print("❌ Could not find save resources handler")

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Successfully updated Settings.jsx with timeline state and handlers!")
