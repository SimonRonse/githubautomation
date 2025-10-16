import TextField from "../../components/shared/TextField";
import { useProject } from "../../contexts/ProjectContext";

export default function GroupNameField() {
    const { project, updateProject } = useProject();
    if (!project) return null;

    return (
        <TextField
            id="group-name"
            label="Group name"
            value={project.groupName}
            onChange={(v) => updateProject({ groupName: v })}
            placeholder="Ex: DEV##Group"
            helper='Type "##" in the group name to include the project ID.'
        />
    );
}
