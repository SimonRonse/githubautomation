import { useState } from "react";
import TextField from "../shared/TextField";

export default function ProjectInviteUrl() {
    const [inviteUrl] = useState(() => {
        const unique = crypto.randomUUID();
        return `${window.location.origin}/register/${unique}`;
    });

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            alert("Failed to copy link.");
        }
    };

    return (
        <section className="invite-url">
            <h2>Registration Link</h2>
            <p className="helper">
                Share this private URL with your students. Only those with the link can register.
            </p>

            <div className="invite-url__field">
                <TextField
                    id="invite-url"
                    label="Invite URL"
                    type="text"
                    value={inviteUrl}
                    onChange={() => {}}
                    placeholder="Invite link"
                    helper={copied ? "Copied!" : undefined}
                />
                <button
                    type="button"
                    className="invite-url__copy-btn"
                    onClick={handleCopy}
                    aria-label="Copy invite link"
                >
                    ⧉
                </button>
            </div>
        </section>
    );
}
