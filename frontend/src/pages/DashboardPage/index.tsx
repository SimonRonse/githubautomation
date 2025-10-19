import { useEffect, useState } from "react";
import "./DashboardPage.scss";
import { getJson } from "../../api/http";
import { useNavigate } from "react-router-dom";

type ProjectShow = {
    id: number;
    name: string;
    avatar_url: string;
    description?: string;
};

export default function DashboardPage() {
    const [projects, setProject] = useState<ProjectShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const res = await getJson<ProjectShow[]>("/projects/");
                setProject(res);
            } catch (err) {
                console.error("Error loading organizations:", err);
                setError("Failed to load organizations.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleProjectClick = (project: ProjectShow) => {
        navigate(`/project/${encodeURIComponent(project.id)}`);
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
            ) : projects.length === 0 ? (
                <p className="dashboard__status">No organizations found.</p>
            ) : (
                <section className="dashboard__grid">
                    {projects.map((project) => (
                        <div key={project.id}
                             className="org-card"
                             role="button"
                             tabIndex={0}
                             onClick={() => handleProjectClick(project)}>
                            <img src={project.avatar_url} alt={project.name} className="org-card__avatar"/>
                            <div className="org-card__info">
                                <h2>{project.name}</h2>
                                {project.description && <p>{project.description}</p>}
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
