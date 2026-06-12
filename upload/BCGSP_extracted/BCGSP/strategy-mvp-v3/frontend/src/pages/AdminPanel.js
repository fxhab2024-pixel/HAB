import { useEffect, useState } from "react";
import { getAdminOverview, getAdminUserReports } from "../api";

export default function AdminPanel({ user }) {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const res = await getAdminOverview(user.user_id);
      setRows(res);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const openUser = async (userId) => {
    setSelected(userId);
    const res = await getAdminUserReports(user.user_id, userId);
    setReports(res);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <h2>پنل مشاور/سرمایهگذار</h2>
      <p>ادمین: <b>{user.name}</b> (ID: {user.user_id})</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ border: "1px solid #ddd", padding: 12 }}>
        <h3>نمای کلی SMEها (رتبهبندی)</h3>
        <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th>نام</th>
              <th>ایمیل</th>
              <th>تعداد گزارش</th>
              <th>میانگین نمره</th>
              <th>آماده سرمایه?</th>
              <th>جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.user_id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.num_reports}</td>
                <td>{r.avg_score}</td>
                <td>{r.investment_ready ? "Yes" : "No"}</td>
                <td><button onClick={() => openUser(r.user_id)}>مشاهده</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
          <h3>گزارشهای SME (User ID: {selected})</h3>
          {reports.length === 0 ? <p>گزارشی نیست.</p> : reports.map(rep => (
            <div key={rep.id} style={{ border: "1px dashed #aaa", padding: 10, marginTop: 10 }}>
              <div><b>Report #{rep.id}</b> — Score: {rep.score} — {rep.created_at ? new Date(rep.created_at).toLocaleString() : ""}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                <div>
                  <b>نقاط شکست</b>
                  <ul>{rep.key_failures.map((x,i)=><li key={i}>{x}</li>)}</ul>
                </div>
                <div>
                  <b>گلوگاهها</b>
                  <ul>{rep.bottlenecks.map((x,i)=><li key={i}>{x}</li>)}</ul>
                </div>
              </div>
              <b>نقشه راه</b>
              <ol>{rep.roadmap.map((x,i)=><li key={i}>{x}</li>)}</ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
