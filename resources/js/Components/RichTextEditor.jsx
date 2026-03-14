import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Box, Typography, useTheme } from '@mui/material';

// Register custom fonts with Quill
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['arial', 'times-new-roman', 'courier-new', 'georgia', 'verdana', 'trebuchet-ms', 'impact'];
ReactQuill.Quill.register(Font, true);

// Register custom font sizes
const Size = ReactQuill.Quill.import('formats/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px'];
ReactQuill.Quill.register(Size, true);

const toolbarOptions = [
    [{ 'font': Font.whitelist }],
    [{ 'size': Size.whitelist }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean'],
];

function getPlainTextWordCount(html) {
    if (!html || html === '<p><br></p>') return 0;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
}

export default function RichTextEditor({ value, onChange, maxWords = 400, error, helperText, label = 'Abstract **' }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const c = theme.palette.custom;

    const wordCount = useMemo(() => getPlainTextWordCount(value), [value]);

    const handleChange = (content) => {
        const wc = getPlainTextWordCount(content);
        if (wc <= maxWords) {
            onChange(content, wc);
        }
    };

    const modules = useMemo(() => ({
        toolbar: toolbarOptions,
    }), []);

    const formats = [
        'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'script',
        'color', 'background',
        'align',
        'list',
    ];

    const editorId = 'abstract-rich-editor';

    return (
        <Box sx={{ position: 'relative' }}>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    color: error ? '#d32f2f' : '#0d7a6a',
                    mb: 1,
                    fontSize: '0.9rem',
                }}
            >
                {label}
            </Typography>

            <Box
                sx={{
                    border: `1px solid ${error ? '#d32f2f' : (isDark ? 'rgba(255,255,255,0.23)' : '#c4c4c4')}`,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                    '&:hover': {
                        borderColor: error ? '#d32f2f' : '#1abc9c',
                    },
                    '&:focus-within': {
                        borderColor: error ? '#d32f2f' : '#1abc9c',
                        boxShadow: `0 0 0 2px ${error ? 'rgba(211,47,47,0.2)' : 'rgba(26,188,156,0.2)'}`,
                    },
                    '& .ql-toolbar': {
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}`,
                        bgcolor: isDark ? 'rgba(0,0,0,0.15)' : '#f9fafb',
                        px: 1,
                        '& .ql-picker-label, & button': {
                            color: isDark ? '#d1d5db' : '#374151',
                        },
                        '& .ql-stroke': {
                            stroke: isDark ? '#d1d5db' : '#374151',
                        },
                        '& .ql-fill': {
                            fill: isDark ? '#d1d5db' : '#374151',
                        },
                        '& .ql-picker-options': {
                            bgcolor: isDark ? '#1f2937' : '#fff',
                            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                    },
                    '& .ql-container': {
                        border: 'none',
                        minHeight: '200px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                    },
                    '& .ql-editor': {
                        minHeight: '200px',
                        color: isDark ? '#f3f4f6' : '#111827',
                        '&.ql-blank::before': {
                            color: isDark ? '#6b7280' : '#9ca3af',
                            fontStyle: 'italic',
                        },
                    },
                    // Custom font faces
                    '& .ql-font-arial': { fontFamily: 'Arial, sans-serif' },
                    '& .ql-font-times-new-roman': { fontFamily: '"Times New Roman", serif' },
                    '& .ql-font-courier-new': { fontFamily: '"Courier New", monospace' },
                    '& .ql-font-georgia': { fontFamily: 'Georgia, serif' },
                    '& .ql-font-verdana': { fontFamily: 'Verdana, sans-serif' },
                    '& .ql-font-trebuchet-ms': { fontFamily: '"Trebuchet MS", sans-serif' },
                    '& .ql-font-impact': { fontFamily: 'Impact, sans-serif' },
                    // Toolbar font picker labels
                    '& .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before, & .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before': { content: '"Arial"', fontFamily: 'Arial, sans-serif' },
                    '& .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before, & .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before': { content: '"Times New Roman"', fontFamily: '"Times New Roman", serif' },
                    '& .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before, & .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before': { content: '"Courier New"', fontFamily: '"Courier New", monospace' },
                    '& .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before, & .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before': { content: '"Georgia"', fontFamily: 'Georgia, serif' },
                    '& .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before, & .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before': { content: '"Verdana"', fontFamily: 'Verdana, sans-serif' },
                    '& .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="trebuchet-ms"]::before, & .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="trebuchet-ms"]::before': { content: '"Trebuchet MS"', fontFamily: '"Trebuchet MS", sans-serif' },
                    '& .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="impact"]::before, & .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="impact"]::before': { content: '"Impact"', fontFamily: 'Impact, sans-serif' },
                    // Font size picker labels
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label::before, & .ql-snow .ql-picker.ql-size .ql-picker-item::before': { content: '"14px"' },
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before': { content: '"10"' },
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before': { content: '"12"' },
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before': { content: '"14"' },
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before': { content: '"16"' },
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before': { content: '"18"' },
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before': { content: '"20"' },
                    '& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before': { content: '"24"' },
                    // Font size rendering
                    '& .ql-snow .ql-editor .ql-size-10px': { fontSize: '10px' },
                    '& .ql-snow .ql-editor .ql-size-12px': { fontSize: '12px' },
                    '& .ql-snow .ql-editor .ql-size-14px': { fontSize: '14px' },
                    '& .ql-snow .ql-editor .ql-size-16px': { fontSize: '16px' },
                    '& .ql-snow .ql-editor .ql-size-18px': { fontSize: '18px' },
                    '& .ql-snow .ql-editor .ql-size-20px': { fontSize: '20px' },
                    '& .ql-snow .ql-editor .ql-size-24px': { fontSize: '24px' },
                }}
            >
                <ReactQuill
                    id={editorId}
                    theme="snow"
                    value={value || ''}
                    onChange={handleChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Enter your paper abstract here..."
                />
            </Box>

            {/* Word Count + Helper Text */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, px: 0.5 }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: error ? '#d32f2f' : '#9ca3af',
                        fontSize: '0.75rem',
                    }}
                >
                    {helperText || 'Please provide a detailed abstract (max 400 words)'}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: wordCount > maxWords ? '#d32f2f' : wordCount > maxWords * 0.9 ? '#f57c00' : '#666',
                    }}
                >
                    {wordCount}/{maxWords} words
                </Typography>
            </Box>
        </Box>
    );
}
