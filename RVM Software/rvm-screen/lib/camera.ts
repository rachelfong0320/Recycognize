export async function getWebcamStream(videoEl: HTMLVideoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false,
  });
  videoEl.srcObject = stream;
  await videoEl.play();
  return stream;
}

export async function captureFrameBlob(
  videoEl: HTMLVideoElement,
  canvasEl: HTMLCanvasElement,
  targetWidth = 720
): Promise<Blob> {
  const vw = videoEl.videoWidth || 1280;
  const vh = videoEl.videoHeight || 720;
  const ratio = vw / vh;
  canvasEl.width = targetWidth;
  canvasEl.height = Math.round(targetWidth / ratio);
  const ctx = canvasEl.getContext("2d")!;
  ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
  return new Promise((resolve) => {
    canvasEl.toBlob((b) => resolve(b!), "image/jpeg", 0.85);
  });
}
