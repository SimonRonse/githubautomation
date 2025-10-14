import { useState } from "react";
import TextField from "../shared/TextField";

export default function OrganizationBox() {
    const [showForm, setShowForm] = useState(false);
    const [orgName, setOrgName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <section className="org-box">
            <header className="org-box__header">
                <h2>Organization</h2>
                <button
                    className="btn btn--small"
                    onClick={() => setShowForm((v) => !v)}
                >
                    {showForm ? "Cancel" : "Create"}
                </button>
            </header>

            {showForm && (
                <div className="org-box__form">
                    <TextField
                        id="org-name"
                        label="Organization Name"
                        value={orgName}
                        onChange={setOrgName}
                        placeholder="Enter organization name"
                        required
                    />
                    <TextField
                        id="org-description"
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="Short description"
                    />
                    <button className="btn">Create Organization</button>
                </div>
            )}
        </section>
    );
}
