import { useProject } from "../../contexts/ProjectContext";
import { useState, useEffect } from "react";
import { getJson } from "../../api/http";

type Organization = { id: number; login: string };

export default function OrganizationSelect() {
    const { project, updateProject } = useProject();
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getJson<Organization[]>("/api/github/orgs");
                setOrgs(res);
            } catch (err) {
                console.error("Failed to load organizations:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (!project) return null;

    return (
        <div className="project-page__section">
            <label htmlFor="organization">Organization</label>
            <div className="org-row">
                <select
                    id="organization"
                    value={project.organization}
                    onChange={(e) => updateProject({ organization: e.target.value })}
                    className="select"
                    disabled={loading}
                >
                    <option value="">
                        {loading ? "Loading..." : "Select organization"}
                    </option>
                    {orgs.map((org) => (
                        <option key={org.id} value={org.login}>
                            {org.login}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn--small"
                    onClick={() =>
                        window.open(
                            "https://github.com/account/organizations/new",
                            "_blank"
                        )
                    }
                >
                    Create
                </button>
            </div>
        </div>
    );
}
