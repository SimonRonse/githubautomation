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
                    value={project.minPersons}
                    onChange={(e) => updateProject({ minPersons: Number(e.target.value) })}
                />
            </div>

            <div className="number-field">
                <label>Max</label>
                <input
                    type="number"
                    min={0}
                    value={project.maxPersons}
                    onChange={(e) => updateProject({ maxPersons: Number(e.target.value) })}
                />
            </div>

            <div className="number-field">
                <label>Total</label>
                <input
                    type="number"
                    min={0}
                    value={project.totalPersons}
                    onChange={(e) => updateProject({ totalPersons: Number(e.target.value) })}
                />
            </div>
        </div>
    );
}
