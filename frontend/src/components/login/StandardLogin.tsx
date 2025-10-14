import { useState } from "react";
import "./StandardLogin.scss";
import TextField from "../shared/TextField.tsx";

export type StandardLoginValues = { username: string; password: string, token: string };
type Props = { onSubmit?:
        (values:
             StandardLoginValues) => void;
             loading?: boolean
             errorMsg?: string | null; };

export default function StandardLogin({ onSubmit, loading, errorMsg }: Props) {
    const [values, setValues] = useState<StandardLoginValues>({ username: "", password: "", token: "" });
    const canSubmit = values.username.trim() && values.password.trim() && values.token.trim();

    const updateField = (key: keyof StandardLoginValues, val: string) =>
        setValues((v) => ({ ...v, [key]: val }));

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

            <TextField
                id="login-username"
                label="Username or email"
                type="text"
                value={values.username}
                onChange={(v) => updateField("username", v)}
                placeholder="you@example.com"
                autoComplete="username"
                required
            />


            <TextField
                id="login-password"
                label="Password"
                type="password"
                value={values.password}
                onChange={(v) => updateField("password", v)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
            />


            <TextField
                id="github-token"
                label="Github Token"
                type="token"
                value={values.token ?? ""}
                onChange={(v) => updateField("token", v)}
                placeholder="ghp_xxx"
            />

            {errorMsg ? (
                <p
                    className="helper"
                    role="alert"
                    style={{color: "var(--danger)", marginTop: "0.5rem"}}
                >
                    {errorMsg}
                </p>
            ) : null}

            <div className="std-login__actions">
                <button className="btn btn--block" type="submit" disabled={!canSubmit || !!loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </div>
        </form>
    );
}
