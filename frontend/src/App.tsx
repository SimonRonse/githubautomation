import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { initialConnected } from "./utils/env.ts";
import PageLayout from "./layouts/PageLayout";
import LoginPage from "./pages/LoginPage";

export default function App() {
    const [connected, setConnected] = useState<boolean>(initialConnected);

    const onLogin = () => setConnected(true);   // demo only
    const onLogout = () => setConnected(false); // demo only

    return (
        <Routes>
            <Route element={<PageLayout connected={connected} onLogout={onLogout} />}>
                {/* all routes go to /login for now */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    );
}
