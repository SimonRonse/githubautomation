export default function ProjectStats() {
    const stats = [
        { label: "Min", value: "—" },
        { label: "Max", value: "—" },
        { label: "Total", value: "—" },
    ];

    return (
        <section className="project-stats">
            {stats.map((s) => (
                <div key={s.label} className="project-stats__tile">
                    <h3>{s.label}</h3>
                    <p>{s.value}</p>
                </div>
            ))}
        </section>
    );
}
