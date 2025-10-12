import "./LoginPage.scss";
import StandardLogin, { type StandardLoginValues } from "../components/login/StandardLogin";
import GithubLogin from "../components/login/GithubLogin";

type Props = { onLogin?: (who?: { username?: string }) => void };

export default function LoginPage({ onLogin }: Props) {
    const handleCredentials = (vals: StandardLoginValues) => onLogin?.({ username: vals.username });
    const handleGitHub = () => onLogin?.({ username: "github_user" });

    return (
        <main className="login-page" role="main" aria-label="Login">
            <div className="login-page__card">
                <div className="login-page__section">
                    <StandardLogin onSubmit={handleCredentials} />
                </div>

                <div className="login-page__divider" aria-hidden="true" />

                <div className="login-page__section">
                    <GithubLogin onClick={handleGitHub} />
                </div>
            </div>
        </main>
    );
}
