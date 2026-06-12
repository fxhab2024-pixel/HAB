import { useEffect, useState } from "react";
import { getReports } from "../api";
import Questionnaire from "../components/Questionnaire";
import ResultDashboard from "../components/ResultDashboard";

export default function Dashboard({ user }) {
  const [reports, setReports] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setError(null);
    try {
      const res = await getReports(user.user_id);
      setReports(res);
    } catch (e) {
      // ok if none yet
      setReports([]);
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>داشبورد SME</h2>
      <p>کاربر: <b>{user.name}</b> (ID: {user.user_id})</p>

      <Questionnaire userId={user.user_id} onResult={(r) => { setResult(r); refresh(); }} />
      <ResultDashboard result={result} />

      <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
        <h3>گزارشهای قبلی</h3>
        {reports.length === 0 ? (
          <p style={{ color: "#666" }}>هنوز گزارشی ثبت نشده است.</p>
        ) : (
          <ul>
            {reports.map(r => (
              <li key={r.id}>#{r.id} — نمره: {r.score} — {r.created_at ? new Date(r.created_at).toLocaleString() : ""}</li>
            ))}
          </ul>
        )}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>
    </div>
  );
}
