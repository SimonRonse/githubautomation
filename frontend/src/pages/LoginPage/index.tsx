import { useState } from "react";
import "./LoginPage.scss";
import StandardLogin, { type StandardLoginValues } from "../../components/login/StandardLogin";
import GithubLogin from "../../components/login/GithubLogin";
import {useAuth} from "../../contexts/AuthContext.tsx"; // adjust path alias if needed

export default function LoginPage() {
    const { login, loading } = useAuth();
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const handleCredentials = async (vals: StandardLoginValues) => {
        setErrMsg(null);
        try {
            await login(vals.username, vals.password);
            // redirect handled by route guard
        } catch (err: any) {
            setErrMsg(err.message);
        }
    };

    const handleGitHub = () => {
        // we’ll implement OAuth later; keep UI for now
        // window.location.href = "/api/github/login";
    };

    return (
        <main className="login-page" role="main" aria-label="Login">
            <div className="login-page__card">
                <div className="login-page__section">
                    <StandardLogin onSubmit={handleCredentials} loading={loading} errorMsg={errMsg}/>
                </div>

                <div className="login-page__divider" aria-hidden="true" />

                <div className="login-page__section">
                    <GithubLogin onClick={handleGitHub} />
                </div>
            </div>
        </main>
    );
}
