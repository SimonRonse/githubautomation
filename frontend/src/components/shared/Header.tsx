import MyLogo from "./MyLogo";
import "./Header.scss";
import {Link} from "react-router-dom";

type HeaderProps = { connected: boolean; onLogout?: () => void };

export default function Header({ connected, onLogout }: HeaderProps) {
    return (
        <header className="app-header" aria-label="Global header">
            <div className="app-header__inner">
                <div className="app-header__brand">
                    <MyLogo size={22} />
                    <Link to={connected ? "/dashboard" : "#"} className="app-header__title">
                        <strong>GitClassroom Automator</strong>
                    </Link>

                </div>
                {connected ? (
                    <button className="btn btn--ghost" onClick={onLogout}>
                        Logout
                    </button>
                ) : null}
            </div>
        </header>
    );
}
