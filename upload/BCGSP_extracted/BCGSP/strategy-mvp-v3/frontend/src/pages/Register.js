import { useState } from "react";
import { registerUser } from "../api";

export default function Register({ onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sme");
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    try {
      const res = await registerUser({ name, email, password, role });
      onRegistered(res);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>ثبتنام</h2>
      <input style={{ width: "100%", padding: 8 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="نام" />
      <input style={{ width: "100%", padding: 8, marginTop: 8 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل" />
      <input style={{ width: "100%", padding: 8, marginTop: 8 }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="رمز" />
      <div style={{ marginTop: 10 }}>
        <label>نقش: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="sme">SME</option>
          <option value="admin">Admin (مشاور/سرمایهگذار)</option>
        </select>
      </div>
      <button style={{ marginTop: 12 }} onClick={submit}>ثبتنام</button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
