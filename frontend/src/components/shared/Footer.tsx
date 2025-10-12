export default function Footer() {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--border)",
                background: "var(--bg-elev)",
                padding: "12px 16px",
                fontSize: 14,
                color: "var(--muted)",
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                © {new Date().getFullYear()} GitClassroom Automator
            </div>
        </footer>
    );
}
