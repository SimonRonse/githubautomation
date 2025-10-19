import { useState } from "react";
import { useProject } from "../../contexts/ProjectContext";

export default function ProjectURLBox() {
    const { project } = useProject();
    const [copied, setCopied] = useState(false);

    if (!project) return null;

    const copyToClipboard = async () => {
        if (!project.key) return;
        await navigator.clipboard.writeText(project.key);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="project-url">
            <label>Student registration URL</label>
            <div className="project-url__row">
                <input type="text" value={project.key || ""} readOnly className="input" />
                <button className="btn btn--ghost" onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
        </div>
    );
}
