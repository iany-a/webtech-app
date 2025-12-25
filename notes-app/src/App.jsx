import { useState } from "react";
import Login from "./Login";
import Notes from "./Notes";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Notes user={user} onLogout={() => {
    localStorage.removeItem("user");
    setUser(null);
  }} />;
}
