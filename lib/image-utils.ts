/**
 * Create a thumbnail from an image file
 * @param file - The image file
 * @param maxWidth - Maximum width for thumbnail (default: 400px)
 * @param maxHeight - Maximum height for thumbnail (default: 400px)
 * @returns Promise<File> - The thumbnail file
 */
export async function createThumbnail(
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create thumbnail blob'))
              return
            }
            
            // Create new file from blob
            const thumbnailFile = new File(
              [blob],
              `thumb_${file.name}`,
              { type: file.type }
            )
            
            resolve(thumbnailFile)
          },
          file.type,
          0.8 // Quality
        )
      }
      
      img.onerror = () => reject(new Error('Could not load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
