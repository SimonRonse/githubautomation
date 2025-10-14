import { useEffect, useState } from "react";
import "./DashboardPage.scss";
import { getJson } from "../../api/http";
import { useNavigate } from "react-router-dom";

type Organization = {
    id: number;
    login: string;
    avatar_url: string;
    description?: string;
};

export default function DashboardPage() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const res = await getJson<Organization[]>("/api/github/orgs");
                setOrgs(res);
            } catch (err) {
                console.error("Error loading organizations:", err);
                setError("Failed to load organizations.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleOrgClick = (org: Organization) => {
        navigate(`/project/${encodeURIComponent(org.login)}`);
    };

    const handleAddClick = () => {
        navigate("/project/new");
    };

    return (
        <main className="dashboard" role="main" aria-label="GitHub Organizations">
            <div className="dashboard-page__header">
                <h1>Your GitHub Organizations</h1>
                <p className="dashboard__subtitle">
                    Manage and create GitHub repositories for your projects
                </p>
            </div>
            {loading ? (
                <p className="dashboard__status">Loading organizations...</p>
            ) : error ? (
                <p className="dashboard__status dashboard__status--error">{error}</p>
            ) : orgs.length === 0 ? (
                <p className="dashboard__status">No organizations found.</p>
            ) : (
                <section className="dashboard__grid">
                    {orgs.map((org) => (
                        <div key={org.id}
                             className="org-card"
                             role="button"
                             tabIndex={0}
                             onClick={() => handleOrgClick(org)}>
                            <img src={org.avatar_url} alt={org.login} className="org-card__avatar"/>
                            <div className="org-card__info">
                                <h2>{org.login}</h2>
                                {org.description && <p>{org.description}</p>}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            <button
                className="dashboard__add-btn"
                aria-label="Add new project"
                onClick={handleAddClick}
            >
                +
            </button>
        </main>
    );
}
