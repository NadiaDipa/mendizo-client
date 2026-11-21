import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Image upload is not configured on the server." },
        { status: 500 }
      );
    }

    const incomingData = await request.formData();
    const image = incomingData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Please select an image file." },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be 5 MB or less." },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      return NextResponse.json(
        { error: result.error?.message || "Image upload failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({ imageUrl: result.data.url });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: "Unable to upload image. Please try again." },
      { status: 500 }
    );
  }
}