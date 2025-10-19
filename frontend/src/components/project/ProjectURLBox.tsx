import {useEffect, useState} from "react";
import { useProject } from "../../contexts/ProjectContext";

export default function ProjectURLBox() {
    const { project } = useProject();
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (project && project.key) {
            setUrl(`${import.meta.env.VITE_GROUP_URL}${project.key}`);
        }
    }, [project]);

    if (!project) return null;

    const copyToClipboard = async () => {
        if (!project.key) return;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };


    return (
        <div className="project-url">
            <label>Student registration URL</label>
            <div className="project-url__row">
                <input type="text" value={url || ""} readOnly className="input" />
                <button className="btn btn--ghost" onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
        </div>
    );
}
