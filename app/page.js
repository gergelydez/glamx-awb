"use client";
import { useState } from "react";

export default function Home() {
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    const res = await fetch("/api/label", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      setLoading(false);
      return;
    }

    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${data.pdf}`;
    link.download = `${tracking}.pdf`;
    link.click();

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>MyGLS Romania Label Downloader</h1>
      <input
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="Tracking number"
      />
      <button onClick={handleDownload}>
        {loading ? "Loading..." : "Download PDF"}
      </button>
    </div>
  );
}