import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function Auth({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false); // toggle mode

    async function handleSubmit() {
        const url = isRegister ? "http://localhost:5000/register" : "http://localhost:5000/login";
        try {
            const res = await axios.post(url, { username, password });
            if (!isRegister) {
                // only save token on login
                localStorage.setItem("token", res.data.token);
                onLogin(username);
            } else {
                alert("Registration successful! You can now login.");
                setIsRegister(false);
            }
        } catch (err) {
            if (err.response) {
                // Server responded with a status outside 2xx
                alert(err.response.data.message || "An error occurred");
            } else if (err.request) {
                // Request was made but no response received
                alert("No response from server. Please check your connection or try again.");
            } else {
                // Something else happened
                alert("Error: " + err.message);
            }
        }

    }

    return (
        <div className="auth-container">
            <input
                placeholder="Username (@stud.ase.ro)"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>{isRegister ? "Register" : "Login"}</button>

            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Go to Login" : "Create account"}
            </button>
        </div>
    );
}
