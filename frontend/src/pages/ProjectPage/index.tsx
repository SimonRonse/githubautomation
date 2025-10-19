import { useProject } from "../../contexts/ProjectContext";
import ProjectHeader from "../../components/project/ProjectHeader";
import ProjectNumbers from "../../components/project/ProjectNumbers.tsx";
import GroupNameField from "../../components/project/GroupNameField.tsx";
import ProjectURLBox from "../../components/project/ProjectURLBox.tsx";
import OrganizationSelect from "../../components/project/OrganizationSelect.tsx";
import "./ProjectPage.scss";
import { useState, useEffect } from "react";

export default function ProjectPage() {
    const { project, loading,updateProject, saveProject, saving } = useProject();
    const [saved, setSaved] = useState(true);
    const [showSavedMessage, setShowSavedMessage] = useState(false);
    const [originalProject, setOriginalProject] = useState(project);

    useEffect(() => {
        if (!originalProject) setOriginalProject(project);
        else if (JSON.stringify(project) !== JSON.stringify(originalProject)) setSaved(false);
        else setSaved(true);
    }, [project, originalProject]);

    function handleSave() {
        saveProject();
        setOriginalProject(project);
        setSaved(true);
        setShowSavedMessage(true);

        setTimeout(() => setShowSavedMessage(false), 2000);
    }

    function handleRevert() {
        updateProject(originalProject!);
        setSaved(true);
        setShowSavedMessage(false);
    }

    if (loading || !project) return <p>Loading project...</p>;

    return (
        <main className="project-page" role="main">
            <ProjectHeader />

            <div className="project-page__content">
                <OrganizationSelect />
                <ProjectNumbers />
                <GroupNameField />

                <div className="project-page__actions">
                    <button
                        className="btn btn--primary"
                        onClick={handleSave}
                        disabled={saved}
                    >
                        Save
                    </button>
                    <button
                        className="btn btn--secondary"
                        onClick={handleRevert}
                        disabled={saved}
                    >
                        Revert
                    </button>

                    <span className="save-status">
                        {!saved
                            ? "  Unsaved changes"
                            : saving? "Saving..." : showSavedMessage && "  All changes saved"}
                    </span>
                </div>
                <ProjectURLBox />
            </div>
        </main>
    );
}