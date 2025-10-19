import { useState, useEffect, type ReactNode } from "react";
import { ProjectContext, type Project } from "./ProjectContext";
import {getJson, patchJson, postJson} from "../api/http";
import {useParams} from "react-router-dom";

type Props = { children: ReactNode };

const emptyProject: Project = {
    id: "new",
    name: "",
    organization: "",
    minPeople: 1,
    maxPeople: 3,
    totalPeople: 0,
    groupNamePattern: "",
    key: "",
};

export function ProjectProvider({ children }: Props) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { projectId } = useParams<{ projectId: string }>();

    const refreshProject = async () => {
        console.log("Loading project", projectId);
        if (projectId === "new") {
            setProject(emptyProject);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getJson<Project>(`/projects/${projectId}`);
            console.log(data);
            setProject(data);
        } catch (err) {
            console.error("Failed to load project:", err);
            emptyProject.name = projectId || "new";
            setProject({ ...emptyProject });
        } finally {
            setLoading(false);
        }
    };

    const updateProject = (updates: Partial<Project>) => {
        setProject((prev) => (prev ? { ...prev, ...updates } : prev));
    };

    const saveProject = async () => {
        if (!project) return;
        setSaving(true);

        try {
            let saved: Project;

            if (project.id === "new" || !project.id) {
                saved = await postJson<Project>("/projects", project);
            } else {
                saved = await patchJson<Project>(`/projects/${project.id}`, project);
            }

            setProject(saved);
            console.log("✅ Project saved:", saved);
        } catch (err) {
            console.error("❌ Failed to save project:", err);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        void refreshProject();
    }, [projectId]);

    return (
        <ProjectContext.Provider
            value={{
                project,
                loading,
                updateProject,
                refreshProject,
                saveProject,
                saving,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
