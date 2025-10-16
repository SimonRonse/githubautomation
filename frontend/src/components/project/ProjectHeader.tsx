import { useState } from "react";
import { useProject } from "../../contexts/ProjectContext";

export default function ProjectHeader() {
    const { project, updateProject } = useProject();
    const [editable, setEditable] = useState(false);
    const [localName, setLocalName] = useState(project?.name || "");

    if (!project) return null;

    const handleEditClick = () => {
        if (editable) {
            updateProject({ name: localName });
        }
        setEditable(!editable);
    };

    return (
        <div className="project-header">
            {editable ? (
                <input
                    type="text"
                    className="project-header__input"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    autoFocus
                />
            ) : (
                <h1 className="project-header__title">{project.name || "New Project"}</h1>
            )}

            <button
                className="btn btn--ghost btn--small"
                onClick={handleEditClick}
            >
                {editable ? "Save name" : "Edit"}
            </button>
            {editable && (
                <button
                    className="btn btn--ghost btn--small"
                    onClick={() => {
                        setEditable(false);
                        setLocalName(project.name || "");
                    }}
                >
                    Cancel
                </button>
            )}
        </div>
    );
}