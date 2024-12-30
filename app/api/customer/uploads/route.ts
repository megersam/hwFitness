import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

// Helper function to parse the request with formidable
const parseForm = async (req: NextRequest) => {
  const form = formidable({
    uploadDir: "./", // Temporary directory for files
    keepExtensions: true,
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    const incomingMessage = new Readable() as any;
    incomingMessage.headers = req.headers;
    incomingMessage.url = req.url;
    incomingMessage.method = req.method;
    incomingMessage.push(req.body);
    incomingMessage.push(null);

    form.parse(incomingMessage, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};

// Export the POST handler
export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    const file = files.image as formidable.File | formidable.File[];
    if (!Array.isArray(file)) {
      const cloudinaryResult = await uploadImageToCloudinary(file.filepath);
      return NextResponse.json({ url: cloudinaryResult.secure_url }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
  } catch (error:any) {
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
