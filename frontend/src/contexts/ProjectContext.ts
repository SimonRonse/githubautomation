import { createContext, useContext } from "react";

export type Project = {
    id: string;
    name: string;
    organization: string;
    minPersons: number;
    maxPersons: number;
    totalPersons: number;
    groupName: string;
    url: string;
};

export type ProjectContextType = {
    project: Project | null;
    loading: boolean;
    updateProject: (updates: Partial<Project>) => void;
    refreshProject: () => Promise<void>;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);

export function useProject() {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error("useProject must be used within ProjectProvider");
    return ctx;
}
