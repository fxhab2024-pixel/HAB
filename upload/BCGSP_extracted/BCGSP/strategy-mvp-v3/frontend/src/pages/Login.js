import { useState } from "react";
import { loginUser } from "../api";

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    try {
      const res = await loginUser({ email, password });
      onLoggedIn(res);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>ورود</h2>
      <input style={{ width: "100%", padding: 8 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل" />
      <input style={{ width: "100%", padding: 8, marginTop: 8 }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="رمز" />
      <button style={{ marginTop: 12 }} onClick={submit}>ورود</button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <p style={{ marginTop: 12, color: "#555" }}>برای تست سریع: اول یک کاربر admin و یک کاربر SME ثبتنام کنید.</p>
    </div>
  );
}
