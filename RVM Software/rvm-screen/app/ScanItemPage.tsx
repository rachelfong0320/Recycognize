"use client";
import React, { useEffect, useRef, useState } from "react";
import { getWebcamStream, captureFrameBlob } from "./../lib/camera";
import { uploadToCloudinary } from "./../lib/cloudinary";

type FrameResult = {
  frameIndex: number;
  imageUrl: string;
  material: string;
  brand: string;
  cap: string;
  confidence: { material: number; brand: number; cap: number };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const LABELS: Record<string, string> = {
  aluminum: "Aluminum",
  glass: "Glass",
  plastic: "Plastic",
  other_materials: "Unaccepted",
  cocacola: "Coca Cola",
  unknown_brand: "Unknown",
  cap_on: "Cap detected",
  cap_off: "Cap undetected",
};

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [frames, setFrames] = useState<FrameResult[]>([]);
  const [finalDecision, setFinalDecision] =
    useState<Omit<FrameResult, "frameIndex" | "imageUrl"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const N = 5; // frames per burst

  useEffect(() => {
    (async () => {
      try {
        await getWebcamStream(videoRef.current!);
        setReady(true);
      } catch (e: any) {
        setError(`Camera error: ${e.message ?? e.toString()}`);
      }
    })();
    return () => {
      const s = videoRef.current?.srcObject as MediaStream | undefined;
      s?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function postScanRecord(payload: {
    imageUrl: string;
    burstId: string;
    frameIndex: number;
  }) {
    console.log("➡️ Sending payload to Lambda:", payload);
    const res = await fetch(`${API_URL}/scan-records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
        console.error("❌ Response not ok:", res.status, res.statusText);
        throw new Error(`POST /scan-records failed: ${res.status}`);}
    const data = await res.json();
     console.log("⬅️ Raw Lambda response:", data);
    try {
    const parsed = JSON.parse(data.body);
    console.log("✅ Parsed body:", parsed);
    return parsed;
  } catch (err) {
    console.error("❌ JSON.parse error:", err, "data.body was:", data.body);
    throw err;
  }
  }

  function aggregate(collected: FrameResult[]) {
    const vote = (k: "material" | "brand" | "cap") => {
      const counts: Record<string, { n: number; conf: number }> = {};
      for (const f of collected) {
        const label = f[k];
        const conf = f.confidence[k] ?? 0;
        counts[label] = counts[label] || { n: 0, conf: 0 };
        counts[label].n += 1;
        counts[label].conf += conf;
      }
      return Object.entries(counts).sort(
        (a, b) => b[1].n - a[1].n || b[1].conf - a[1].conf
      )[0][0];
    };
    const avg = (k: "material" | "brand" | "cap") =>
      collected.reduce((s, f) => s + (f.confidence[k] || 0), 0) /
      collected.length;

    return {
      material: vote("material"),
      brand: vote("brand"),
      cap: vote("cap"),
      confidence: {
        material: avg("material"),
        brand: avg("brand"),
        cap: avg("cap"),
      },
    };
  }

  async function runBurst() {
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    setFrames([]);
    setFinalDecision(null);

    const burstId = `burst-${Date.now()}`;
    const GAP_MS = 50;

    const collected: FrameResult[] = [];

    try {
      for (let i = 0; i < N; i++) {
        const blob = await captureFrameBlob(videoRef.current!, canvasRef.current!);
        const imageUrl = await uploadToCloudinary(blob);
        const item = await postScanRecord({ imageUrl, burstId, frameIndex: i });

        collected.push({
          frameIndex: i,
          imageUrl,
          material: item.material,
          brand: item.brand,
          cap: item.cap,
          confidence: {
            material: Number(item.confidence?.material ?? 0),
            brand: Number(item.confidence?.brand ?? 0),
            cap: Number(item.confidence?.cap ?? 0),
          },
        });
        setFrames([...collected]);
        await new Promise((r) => setTimeout(r, GAP_MS));
      }
      const final = aggregate(collected);
      setFinalDecision(final);

      await postScanRecord({
        imageUrl: collected[0].imageUrl,
        burstId,
        frameIndex: -1,
        ...final,
      });
    } catch (e: any) {
      setError(e.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  const progress = (frames.length / N) * 100;

  // Decide acceptance/rejection copy
  function getDecisionMessage() {
    if (!finalDecision) return null;
    if (finalDecision.material === "other_materials") {
      return "❌ Sorry. This material is rejected. \n We only accept glass, aluminum, tetrapak, and plastic bottles.";
    }
    if (finalDecision.cap === "cap_on") {
      return "⚠️ Please remove the bottle cap before recycling.";
    }
    return "✅ Item accepted! Thank you for helping the world 🌍";
  }

  return (
    <main className="flex px-6 items-center justify-center h-screen bg-white">
      <div className="flex w-ful h-[80vh] border border-gray-300 rounded-xl overflow-hidden">
        {/* Left: Big Scanner */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right: Controls */}
        <div className="w-1/3 flex flex-col p-6 bg-gray-50">
          {/* Big Scan Button */}
          <button
            onClick={runBurst}
            disabled={!ready || busy}
            className="w-full text-2xl py-6 bg-black text-white disabled:opacity-50"
          >
            {busy ? "Scanning..." : "Scan Item"}
          </button>

          {/* Progress */}
          {busy && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                <div
                  className="bg-gray-800 h-5 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {/* Final Decision Table */}
          {finalDecision && (
            <div className="mt-6 flex-1 overflow-y-auto">
              <table className="w-full border border-gray-300 text-lg w-full text-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left border border-gray-300">
                      Property
                    </th>
                    <th className="px-4 py-2 text-left border border-gray-300">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">Material</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {LABELS[finalDecision.material] || finalDecision.material}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">Brand</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {LABELS[finalDecision.brand] || finalDecision.brand}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-300">Cap</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {LABELS[finalDecision.cap] || finalDecision.cap}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {/* Decision message */}
              <p className="mt-4 text-xl font-bold">
                {getDecisionMessage()}
              </p>
        </div>
      </div>
    </main>
  );
}
