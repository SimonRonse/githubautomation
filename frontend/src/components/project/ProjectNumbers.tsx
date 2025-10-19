import { useProject } from "../../contexts/ProjectContext";

export default function ProjectNumbers() {
    const { project, updateProject } = useProject();
    if (!project) return null;

    return (
        <div className="project-numbers">
            <div className="number-field">
                <label>Min</label>
                <input
                    type="number"
                    min={0}
                    value={project.minPeople}
                    onChange={(e) => updateProject({ minPeople: Number(e.target.value) })}
                />
            </div>

            <div className="number-field">
                <label>Max</label>
                <input
                    type="number"
                    min={0}
                    value={project.maxPeople}
                    onChange={(e) => updateProject({ maxPeople: Number(e.target.value) })}
                />
            </div>

            <div className="number-field">
                <label>Total</label>
                <input
                    type="number"
                    min={0}
                    value={project.totalPeople}
                    onChange={(e) => updateProject({ totalPeople: Number(e.target.value) })}
                />
            </div>
        </div>
    );
}
