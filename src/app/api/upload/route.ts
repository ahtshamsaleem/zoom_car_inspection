import { NextResponse } from "next/server";
import axios from "axios";

interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  mime: string;
}


const UPLOAD_API_URL = process.env.UPLOAD_API_URL;
const UPLOAD_API_KEY = process.env.UPLOAD_API_KEY;




export async function POST(request: Request) {
  try {
    if (!UPLOAD_API_URL || !UPLOAD_API_KEY) {
      console.error("Missing UPLOAD_API_URL or UPLOAD_API_KEY env var");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max 10MB" },
        { status: 400 }
      );
    }


    
const uploadRes = await axios.post<UploadResponse>(UPLOAD_API_URL, formData, {
  headers: {
 
    "x-api-key": UPLOAD_API_KEY,
  },
  maxBodyLength: Infinity,
});

const data = uploadRes.data; // typed as UploadResponse

return NextResponse.json({
  success: true,
  url: data.url,
  filename: data.filename,
  size: data.size,
  type: data.mime,
});
  } catch (err) {
    console.log("ERROR", err)
    if (axios.isAxiosError(err)) {
      console.error("Upload API error:", err.response?.status, err.response?.data);
    } else {
      console.error("Upload route error:", err);
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
