import { useState } from "react";
import { diagnose } from "../api";

export default function Questionnaire({ userId, onResult }) {
  const [form, setForm] = useState({
    business_model: "",
    market_position: "",
    operations: "",
    finance: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await diagnose({ user_id: userId, ...form });
      onResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
      <h3>تشخیص استراتژیک</h3>
      <textarea name="business_model" value={form.business_model} onChange={onChange} placeholder="مدل کسبوکار" rows={3} style={{ width: "100%" }} />
      <textarea name="market_position" value={form.market_position} onChange={onChange} placeholder="بازار و رقبا" rows={3} style={{ width: "100%" }} />
      <textarea name="operations" value={form.operations} onChange={onChange} placeholder="عملیات و فرآیندها" rows={3} style={{ width: "100%" }} />
      <textarea name="finance" value={form.finance} onChange={onChange} placeholder="مالی" rows={3} style={{ width: "100%" }} />

      <button onClick={onSubmit} disabled={loading}>
        {loading ? "در حال تحلیل..." : "ارسال برای تحلیل"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
