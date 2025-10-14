import { useState } from "react";
import TextField from "../shared/TextField";

export default function GroupSettings() {
    const [groupName, setGroupName] = useState("");
    const [useTemplate, setUseTemplate] = useState(false);

    return (
        <section className="group-settings">
            <h2>Group Settings</h2>
            <p className="helper">
                Type <code>##</code> anywhere in the group name to include the ID automatically.
            </p>

            <TextField
                id="group-name"
                label="Group Name"
                value={groupName}
                onChange={setGroupName}
                placeholder="ex: group_##_2025"
            />

            <label className="checkbox-row">
                <input
                    type="checkbox"
                    checked={useTemplate}
                    onChange={(e) => setUseTemplate(e.target.checked)}
                />
                <span>Use group template configuration</span>
            </label>
        </section>
    );
}
