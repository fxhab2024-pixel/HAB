import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => setMode("login")}>ورود</button>
          <button onClick={() => setMode("register")} style={{ marginLeft: 8 }}>ثبتنام</button>
        </div>
        {mode === "login" ? (
          <Login onLoggedIn={(u) => setUser(u)} />
        ) : (
          <Register onRegistered={() => setMode("login")} />
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <button onClick={() => setUser(null)}>خروج</button>
      </div>
      {user.role === "admin" ? <AdminPanel user={user} /> : <Dashboard user={user} />}
    </div>
  );
}
