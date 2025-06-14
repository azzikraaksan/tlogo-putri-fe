"use client";

import { useState } from "react";
import Hashids from "hashids";

const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHIDS_SECRET, 20);

export default function ClientConfirmPage({ rotasi_id }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [skipReason, setSkipReason] = useState("");
  const [showSkipReason, setShowSkipReason] = useState(false);

  const decoded = hashids.decode(rotasi_id);
  const realId = decoded[0];

  if (!realId) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "red" }}>
        ID rotasi tidak valid atau link rusak 😢
      </div>
    );
  }

  async function handleConfirm(canGo) {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      let res;
      if (canGo) {
        res = await fetch(
          `https://tpapi.siunjaya.id/api/driver-rotations/${realId}/assign`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        if (!skipReason.trim()) {
          setError("Mohon isi alasan tidak bisa berangkat.");
          setLoading(false);
          return;
        }

        res = await fetch(
          `https://tpapi.siunjaya.id/api/driver-rotations/${realId}/skip`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skip_reason: skipReason }),
          }
        );
      }

      if (res.ok) {
        setMessage("Terima kasih, konfirmasi Anda sudah kami terima.");
      } else {
        const data = await res.json();
        setError(data.error || "Terjadi kesalahan saat mengirim konfirmasi.");
      }
    } catch {
      setError("Gagal mengirim konfirmasi. Silakan coba lagi.");
    }

    setLoading(false);
  }
  

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 400,
        margin: "40px auto",
        border: "1px solid #ddd",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: 10, textAlign: "center" }}>Konfirmasi Kehadiran</h2>
      <p style={{ marginBottom: 20, textAlign: "center" }}>
        Apakah Anda bisa berangkat?
      </p>

      {message && (
        <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
          {error}
        </p>
      )}

      {!message && (
        <>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <button
              onClick={() => {
                setShowSkipReason(false);
                handleConfirm(true);
              }}
              disabled={loading}
              style={{
                padding: "8px 20px",
                backgroundColor: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              Bisa
            </button>

            <button
              onClick={() => setShowSkipReason(true)}
              disabled={loading}
              style={{
                padding: "8px 20px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              Tidak Bisa
            </button>
          </div>

          {showSkipReason && (
            <div style={{ marginTop: 20 }}>
              <label
                htmlFor="skipReason"
                style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}
              >
                Alasan tidak bisa:
              </label>
              <input
                id="skipReason"
                type="text"
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                disabled={loading}
                placeholder="Misal: Sakit, ada urusan, dll."
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 5,
                  border: "1px solid #ccc",
                  marginBottom: 10,
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => handleConfirm(false)}
                disabled={loading || !skipReason.trim()}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor:
                    loading || !skipReason.trim() ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                Kirim Alasan
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
