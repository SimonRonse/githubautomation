import { Outlet } from "react-router-dom";
import Header from "../components/shared/Header";
import "./PageLayout.scss";

type Props = { connected: boolean; onLogout: () => void };

export default function PageLayout({ connected, onLogout }: Props) {
    return (
        <div className="page-layout">
            <Header connected={connected} onLogout={onLogout} />
            <main className="page-main">
                <Outlet />
            </main>
        </div>
    );
}
