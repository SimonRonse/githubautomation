import { GitHubIcon } from "../shared/GitHubIcon";
import "./GithubLogin.scss";

type Props = { onClick?: () => void };

export default function GithubLogin({ onClick }: Props) {
    return (
        <div className="github-login" role="region" aria-label="Continue with GitHub">
            <h2 className="form__title">Continue with GitHub</h2>
            <p className="helper github-login__helper">Use your GitHub account to sign in securely.</p>
            <button
                className="btn btn--github btn--block"
                type="button"
                onClick={onClick}
            >
                <GitHubIcon/>
                <span>Sign in with GitHub</span>
            </button>

            <div className="divider" aria-hidden></div>

            <p className="helper">
                By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </p>
            <p className="helper github-login__support">
                Trouble signing in? <a href="#">Contact support</a>.
            </p>
        </div>
    );
}
