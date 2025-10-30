# ⚠️ Important: File Upload Limitations on Vercel

## The Problem

Vercel serverless functions have a **read-only filesystem** except for the `/tmp` directory. This means:

1. ❌ Cannot write to `./public/uploads/`
2. ❌ Cannot create directories in `/var/task/`
3. ✅ Can only write to `/tmp/` (temporary storage)

## Current Solution

The `config/upload.js` has been configured to:
- **Production (Vercel)**: Use `/tmp/uploads` directory
- **Development (Local)**: Use `./public/uploads` directory

## ⚠️ Critical Limitations

### 1. Files in `/tmp` are NOT persistent
- Files uploaded to `/tmp` are **deleted when the serverless function terminates**
- Each function invocation gets a fresh `/tmp` directory
- Files are **NOT accessible across different function instances**

### 2. Files are NOT publicly accessible
- Files in `/tmp` cannot be served as static assets
- You cannot access them via URLs like `/uploads/image.jpg`

## Recommended Solutions

### Option 1: Use Cloud Storage (Recommended for Production)
Use a cloud storage service to store uploaded files:

#### A. AWS S3
```bash
npm install aws-sdk multer-s3
```

#### B. Cloudinary (Easiest)
```bash
npm install cloudinary multer-storage-cloudinary
```

#### C. Vercel Blob Storage
```bash
npm install @vercel/blob
```

### Option 2: Base64 Encoding (For Small Images)
Store images as base64 strings directly in MongoDB:
- ✅ No external storage needed
- ❌ Increases database size
- ❌ Slower performance for large images

### Option 3: External Image Hosting
Use services like:
- Imgur API
- ImgBB API
- Cloudinary

## Implementation Example (Cloudinary)

### 1. Install Cloudinary
```bash
npm install cloudinary multer-storage-cloudinary
```

### 2. Update `config/upload.js`
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tesla-stock-brokerage',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });
```

### 3. Add Environment Variables
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Current File Upload Routes

Check these routes that use file uploads:
- `POST /dashboard/payment` - Payment proof upload
- Any other routes using `upload.single()` or `upload.array()`

## Action Required

**For production deployment on Vercel, you MUST:**
1. Choose a cloud storage solution (Cloudinary recommended)
2. Update `config/upload.js` with the new storage
3. Add required environment variables to Vercel
4. Test file uploads thoroughly

## Temporary Workaround

The current `/tmp` solution will work for:
- ✅ Development/testing
- ✅ Immediate file processing (resize, validate, then save to DB)
- ❌ NOT for persistent file storage
- ❌ NOT for serving files to users

## Questions?

If you need help implementing cloud storage, let me know which service you prefer:
1. Cloudinary (easiest, free tier available)
2. AWS S3 (most flexible, requires AWS account)
3. Vercel Blob (integrated with Vercel)
