import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("Confirming...");
  const [calendar, setCalendar] = useState<any>(null);

  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("No session id found");
      return;
    }

    const confirm = async () => {
      try {
        const res = await axiosInstance.get(
          `/payments/confirm-checkout-session?session_id=${encodeURIComponent(sessionId)}`
        );

        setStatus(res.data?.message || "Booking confirmed");

        // 👉 Step 7: store calendar links from backend
        setCalendar(res.data?.calendar || null);

        setTimeout(() => navigate("/profile"), 3000);
      } catch (err) {
        console.error(err);
        setStatus("Failed to confirm booking");
      }
    };

    confirm();
  }, [search, navigate]);

  return (
    <div style={{ padding: 30 }}>
      <h1>✅ {status}</h1>

      {/* ===================== */}
      {/* STEP 7 UI */}
      {/* ===================== */}

      {calendar && (
        <div style={{ marginTop: 20 }}>
          <h3>Add to Calendar</h3>

          <a
            href={calendar.googleCalendarUrl}
            target="_blank"
            style={{ display: "block", marginBottom: 10 }}
          >
            📅 Add to Google Calendar
          </a>

          <a
            href={calendar.icsFileUrl}
            download
            style={{ display: "block" }}
          >
            🍏 Download Apple Calendar (.ics)
          </a>
        </div>
      )}

      <p style={{ marginTop: 12, color: "#555" }}>
        You will be redirected shortly.
      </p>
    </div>
  );
};

export default PaymentSuccess;