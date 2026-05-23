/**
 * Utility to convert various image hosting URLs to direct image URLs
 */
export function getDirectImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // Clean the URL whitespace
  const cleanUrl = url.trim();

  // 1. Google Drive Link conversion
  // Standard format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Open format: https://drive.google.com/open?id=FILE_ID
  // Direct format we want: https://lh3.googleusercontent.com/u/0/d/FILE_ID
  
  const driveMatch = cleanUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    // Return the direct link that bypasses the viewer page
    // Alternative: `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`
    return `https://lh3.googleusercontent.com/u/0/d/${driveMatch[1]}`;
  }

  // 2. DropBox Link conversion
  // Change ?dl=0 to ?raw=1
  if (cleanUrl.includes('dropbox.com') && cleanUrl.includes('?dl=0')) {
    return cleanUrl.replace('?dl=0', '?raw=1');
  }

  return cleanUrl;
}

/**
 * Converts a File object to a Base64 string
 * Includes a size check to stay within Firestore limits (max 500KB recommended)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // 500KB check
    if (file.size > 500 * 1024) {
      reject(new Error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 500KB.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
