import { useState, useEffect, type ReactNode } from "react";
import { ProjectContext, type Project } from "./ProjectContext";
import { getJson } from "../api/http";
import {useParams} from "react-router-dom";

type Props = { children: ReactNode };

const emptyProject: Project = {
    id: "new",
    name: "",
    organization: "",
    minPersons: 1,
    maxPersons: 3,
    totalPersons: 0,
    groupName: "",
    url: "",
};

export function ProjectProvider({ children }: Props) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
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
            const data = await getJson<Project>(`/api/projects/${projectId}`);
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
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
