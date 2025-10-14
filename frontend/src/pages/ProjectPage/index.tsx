import { useParams } from "react-router-dom";
import { useState } from "react";
import "./ProjectPage.scss";
import OrganizationBox from "../../components/project/OrganizationBox";
import ProjectStats from "../../components/project/ProjectStats";
import GroupSettings from "../../components/project/GroupSettings";
import UrlListBox from "../../components/project/ProjectInviteUrl.tsx";

export default function ProjectPage() {
    const { org } = useParams<{ org: string }>();
    const projectName = org === "new" ? "New Project" : org ?? "Unnamed Project";

    const [urls, setUrls] = useState<string[]>([
        "https://github.com/example/repo1",
        "https://github.com/example/repo2",
    ]);

    return (
        <main className="project-page">
            <header className="project-page__header">
                <h1>{projectName}</h1>
            </header>

            <OrganizationBox />

            <section className="project-page__content">
                <ProjectStats />

                <GroupSettings />

                <UrlListBox urls={urls} onChange={setUrls} />
            </section>
        </main>
    );
}
