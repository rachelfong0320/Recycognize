export async function uploadToCloudinary(blob: Blob): Promise<string> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD!;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const form = new FormData();
  form.append("file", blob);
  form.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.secure_url as string; // public URL for Roboflow
}
