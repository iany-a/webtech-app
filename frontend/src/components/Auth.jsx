import { useState } from "react";
import axios from "axios";
import "../App.css";

export default function Auth({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async () => {
        const url = isRegister ? "http://localhost:5000/register" : "http://localhost:5000/login";

        try {
            const res = await axios.post(url, { username, password });

            if (isRegister) {
                alert("Registration successful! You can now login.");
                setIsRegister(false);
            } else {
                // Login: store token + username
                const token = res.data.token;
                localStorage.setItem("user", username);
                localStorage.setItem("token", token);
                onLogin(username, token);
            }
        } catch (err) {
            if (err.response) {
                alert(err.response.data.message || "An error occurred");
            } else if (err.request) {
                alert("No response from server. Check your connection.");
            } else {
                alert("Error: " + err.message);
            }
        }
    };

    return (
        <div className="auth-container">
            <input
                placeholder="Username (@stud.ase.ro)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>{isRegister ? "Register" : "Login"}</button>

            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Go to Login" : "Create account"}
            </button>
        </div>
    );
}
