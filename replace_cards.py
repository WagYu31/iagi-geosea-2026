import os

# Read the file
file_path = r'c:\laragon\www\iagi-geosea-2026\resources\js\Pages\Admin\Settings.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lines to replace: 925-1138 (0-indexed: 924-1137)
start_line = 924  # Line 925 in 1-indexed
end_line = 1137   # Line 1138 in 1-indexed

# Replacement content
replacement = """                                        <DynamicResourceCards
                                            resources={resources}
                                            setResources={setResources}
                                            uploading={uploading}
                                            handleResourceFileUpload={handleResourceFileUpload}
                                            handleResourceDelete={handleResourceDelete}
                                        />
"""

# Create new content
new_lines = lines[:start_line] + [replacement] + lines[end_line + 1:]

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Successfully replaced lines 925-1138 with DynamicResourceCards component!")
print(f"Deleted {end_line - start_line + 1} lines, added 1 component call")
