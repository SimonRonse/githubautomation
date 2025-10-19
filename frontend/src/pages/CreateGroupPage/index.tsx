import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TextField from "../../components/shared/TextField";
import "./CreateGroupPage.scss";
import {getJson, postJson} from "../../api/http";

type ProjectInfo = {
    id: number;
    name: string;
    minPeople: number;
    maxPeople: number;
};

type Student = {
    name: string;
    github: string;
};

export default function CreateGroupPage() {
    const { projectUrl } = useParams<{ projectUrl: string }>();
    const [project, setProject] = useState<ProjectInfo | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const data = await getJson<ProjectInfo>(`/group/${projectUrl}`);
                setProject(data);
                console.log(data);
                setStudents(Array.from({ length: data.maxPeople }, () => ({ name: "", github: "" })));
            } catch (err) {
                console.error(err);
                setError("Project not found or invalid link.");
            } finally {
                setLoading(false);
            }
        })();
    }, [projectUrl]);

    const handleChange = (index: number, key: keyof Student, value: string) => {
        setStudents((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validCount = students.filter((s) => s.name.trim()).length;
        if (!project) return;
        if (validCount < project.minPeople)
            return;
        await postJson(`/group/${projectUrl}`, {
            students: students.filter(s => s.name && s.github),
        });
        // TODO: send to backend
        console.log("Submitting group:", students);
        alert("Group submitted successfully!");
    };

    if (loading) return <p>Loading project...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!project) return null;

    return (
        <main className="join-group-page" role="main" aria-label="Join group">
            <h1>Join Project: {project.name}</h1>
            <p className="helper">
                Minimum {project.minPeople} students, maximum {project.maxPeople}
            </p>

            <form onSubmit={handleSubmit} className="join-group-form">
                {students.map((s, i) => (
                    <div key={i} className="join-group-row">
                        <TextField
                            id={`student-${i}-name`}
                            label={`Student ${i + 1}`}
                            value={s.name}
                            onChange={(v) => handleChange(i, "name", v)}
                            placeholder={i < project.minPeople ? "Full name" : "Full name (optional)"}
                        />
                        <TextField
                            id={`student-${i}-github`}
                            label="GitHub username"
                            value={s.github}
                            onChange={(v) => handleChange(i, "github", v)}
                            placeholder={i < project.minPeople ? "GitHub username" : "GitHub username (optional)"}
                        />
                    </div>
                ))}
                <button className="btn btn--block" type="submit">
                    Save Group
                </button>
            </form>
        </main>
    );
}
