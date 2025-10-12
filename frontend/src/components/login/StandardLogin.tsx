import { useState } from "react";
import "./StandardLogin.scss";

export type StandardLoginValues = { username: string; password: string };
type Props = { onSubmit?: (values: StandardLoginValues) => void; loading?: boolean };

export default function StandardLogin({ onSubmit, loading }: Props) {
    const [values, setValues] = useState<StandardLoginValues>({ username: "", password: "" });
    const canSubmit = values.username.trim() && values.password.trim();

    return (
        <form
            className="std-login"
            onSubmit={(e) => {
                e.preventDefault();
                if (!canSubmit) return;
                onSubmit?.(values);
            }}
            aria-label="Sign in with username and password"
        >
            <h1 className="form__title">Sign in</h1>

            <div className="form__group">
                <label htmlFor="login-username">Username or email</label>
                <input
                    id="login-username"
                    className="input"
                    autoComplete="username"
                    value={values.username}
                    onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="form__group">
                <div className="std-login__row">
                    <label htmlFor="login-password">Password</label>
                    <a href="#" className="helper" onClick={(e) => e.preventDefault()}>
                        Forgot password?
                    </a>
                </div>
                <input
                    id="login-password"
                    className="input"
                    type="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                />
            </div>

            <div className="std-login__actions">
                <button className="btn btn--block" type="submit" disabled={!canSubmit || !!loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </div>
        </form>
    );
}
