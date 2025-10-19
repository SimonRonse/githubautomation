import { createContext, useContext } from "react";

export type Project = {
    id: string;
    name: string;
    organization: string;
    minPeople: number;
    maxPeople: number;
    totalPeople: number;
    groupNamePattern: string;
    key: string;
};

export type ProjectContextType = {
    project: Project | null;
    loading: boolean;
    saving?: boolean;
    updateProject: (updates: Partial<Project>) => void;
    refreshProject: () => Promise<void>;
    saveProject: () => Promise<void>;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error("useProject must be used within ProjectProvider");
    return ctx;
}
