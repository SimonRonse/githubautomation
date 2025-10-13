import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import PageLayout from "./layouts/PageLayout";
import LoginPage from "./pages/LoginPage";
import type { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isConnected, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    return isConnected ? children : <Navigate to="/login" replace />;
}

function LoggedInRedirect({ children }: { children: JSX.Element }) {
    const { isConnected, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    return isConnected ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
    const { logout, isConnected } = useAuth();

    return (
        <Routes>
            <Route element={<PageLayout connected={isConnected} onLogout={logout} />}>
                {/* If connected, /login → /dashboard */}
                <Route
                    path="/login"
                    element={
                        <LoggedInRedirect>
                            <LoginPage />
                        </LoggedInRedirect>
                    }
                />

                {/* Only connected users can view /dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <h1>Dashboard</h1>
                        </ProtectedRoute>
                    }
                />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
}
