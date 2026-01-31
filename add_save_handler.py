import re

# Read the file
file_path = r'c:\laragon\www\iagi-geosea-2026\resources\js\Pages\Admin\Settings.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the position after handleResourceDelete function
pattern = r'(    // Handle resource delete\s+const handleResourceDelete.*?\}\s*\};)'
match = re.search(pattern, content, re.DOTALL)

if match:
    # Add the new handler after handleResourceDelete
    insertion_point = match.end()
    new_handler = """

    // Handle save resources (metadata only, no file upload required)
    const handleSaveResources = async () => {
        try {
            const response = await axios.post(route('admin.settings.saveResources'), {
                resources: resources
            });

            if (response.data.success) {
                setResources(response.data.resources);
                router.reload({ preserveScroll: true });
                alert('Resources saved successfully!');
            }
        } catch (error) {
            console.error('Save resources error:', error);
            alert('Failed to save resources');
        }
    };"""
    
    new_content = content[:insertion_point] + new_handler + content[insertion_point:]
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully added handleSaveResources handler!")
else:
    print("Could not find handleResourceDelete function!")
