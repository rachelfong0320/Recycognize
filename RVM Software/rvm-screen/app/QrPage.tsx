import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const QrPage: React.FC = () => {
  const [qrValue, setQrValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Generate sessionId + rvmId payload
    // const sessionId = uuidv4();
    const sessionId = "sess-1758356404024"; 
    const rvmId = "rvm-1";
    const payload = { sessionId, rvmId };

    setQrValue(JSON.stringify(payload));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans">
      <h1 className="text-2xl mb-6">RVM QR Check-in</h1>

      {qrValue && (
        <div className="mb-8 text-center">
          <QRCodeCanvas value={qrValue} size={300} />
        </div>
      )}

      <button
        onClick={() => navigate("/scan")}
        className="px-6 py-3 text-lg bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Next
      </button>
    </div>
  );
};

export default QrPage;
