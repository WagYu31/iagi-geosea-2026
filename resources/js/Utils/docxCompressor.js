import JSZip from 'jszip';

/**
 * Compresses an image blob using HTML5 Canvas.
 * @param {Blob} blob - The original image blob.
 * @param {string} filename - The name of the file.
 * @returns {Promise<Blob>} - The compressed image blob, or the original if compression failed/was not smaller.
 */
function compressImage(blob, filename) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            
            // Compression limits
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;
            
            let needsResize = false;
            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
                needsResize = true;
            }
            if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
                needsResize = true;
            }
            
            const isPng = filename.toLowerCase().endsWith('.png');
            const isJpg = filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg');
            
            // Skip compression if the image is already small and doesn't need resizing
            if (!needsResize && blob.size < 150 * 1024) {
                resolve(blob);
                return;
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            const mimeType = isPng ? 'image/png' : 'image/jpeg';
            const quality = isPng ? undefined : 0.75;
            
            canvas.toBlob((resultBlob) => {
                if (resultBlob && resultBlob.size < blob.size) {
                    resolve(resultBlob);
                } else {
                    resolve(blob); // Return original if compression was larger
                }
            }, mimeType, quality);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(blob); // Fallback to original
        };
        img.src = url;
    });
}

/**
 * Unzips a DOCX file, compresses all images found in word/media/, and returns a new compressed DOCX File.
 * @param {File} file - The original DOCX File.
 * @param {Function} onProgress - Optional callback for progress updates (e.g. (current, total) => {})
 * @returns {Promise<File>} - The compressed DOCX File, or the original if it was not a DOCX or if compression failed.
 */
export async function compressDocx(file, onProgress = null) {
    if (!file || !file.name.toLowerCase().endsWith('.docx')) {
        return file;
    }

    try {
        const zip = new JSZip();
        // Load the zip content
        const content = await zip.loadAsync(file);
        
        // Find all image files in word/media/
        const mediaFolder = content.folder('word/media');
        if (!mediaFolder) {
            return file; // No media folder, nothing to compress
        }

        const imageFiles = [];
        mediaFolder.forEach((relativePath, fileEntry) => {
            if (!fileEntry.dir) {
                const lowerName = fileEntry.name.toLowerCase();
                if (lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
                    imageFiles.push(fileEntry);
                }
            }
        });

        if (imageFiles.length === 0) {
            return file; // No images to compress
        }

        let compressedCount = 0;
        const totalImages = imageFiles.length;

        // Process each image file
        for (const fileEntry of imageFiles) {
            // Read file as blob
            const originalData = await fileEntry.async('blob');
            
            // Compress the image
            const compressedBlob = await compressImage(originalData, fileEntry.name);
            
            // Update the file inside the zip archive
            zip.file(fileEntry.name, compressedBlob);
            
            compressedCount++;
            if (onProgress) {
                onProgress(compressedCount, totalImages);
            }
        }

        // Generate the new zip archive as a blob
        const outputBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9 // Max compression
            }
        });

        // Return a new File object with the same name and metadata
        return new File([outputBlob], file.name, {
            type: file.type,
            lastModified: file.lastModified
        });
    } catch (error) {
        console.error('Failed to compress DOCX file:', error);
        return file; // Return original file on failure
    }
}
