import re

# Read the file
file_path = r'c:\laragon\www\iagi-geosea-2026\resources\js\Pages\Admin\Settings.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line after Resources Card closes (after line 993 </Card>)
# Insert Timeline section after line 994 (blank line after Resources Card)
insert_line = 994  # 0-indexed would be 993

timeline_section = """
                                {/* Timeline Section */}
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#006838' }}>
                                            Conference Timeline
                                        </Typography>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            Manage important conference dates and milestones
                                        </Alert>

                                        <DynamicTimelineCards
                                            timeline={timeline}
                                            setTimeline={setTimeline}
                                            handleTimelineDelete={handleTimelineDelete}
                                        />

                                        {/* Save All Timeline Button */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={handleSaveTimeline}
                                                sx={{
                                                    backgroundColor: '#006838',
                                                    '&:hover': { backgroundColor: '#004d28' },
                                                }}
                                            >
                                                Save All Timeline
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

"""

# Insert the timeline section
lines.insert(insert_line, timeline_section)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✅ Successfully added Timeline section to Settings.jsx!")
