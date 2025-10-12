type Props = { size?: number };

export default function MyLogo({ size = 28 }: Props) {
    return (
        <div className="header" aria-label="App logo">
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
            >
                {/* Minimal, GitHub-esque silhouette (not the official mark) */}
                <path
                    d="M12 2c5.5 0 10 4.5 10 10 0 4.4-2.9 8.1-6.9 9.4-.5.1-.7-.2-.7-.5v-2.2c0-.8-.3-1.3-.7-1.6 2.3-.3 4.7-1.1 4.7-5 0-1.1-.4-2-1.1-2.8.1-.3.5-1.3-.1-2.8 0 0-.9-.3-2.9 1.1-.8-.2-1.7-.3-2.6-.3s-1.8.1-2.6.3c-2-1.4-2.9-1.1-2.9-1.1-.6 1.5-.2 2.5-.1 2.8-.7.8-1.1 1.7-1.1 2.8 0 3.9 2.4 4.7 4.7 5-.3.2-.6.6-.7 1.1-.3.2-.9.4-1.3 0-.4-.4-.9-1.2-1.8-1.2-1 0-1.2.6-1.2.9 0 .4.3.8.6 1.1.5.5 1.3.8 2.1.8.7 0 1.3-.1 1.7-.3v1.9c0 .3-.2.6-.7.5C4.9 20.1 2 16.4 2 12 2 6.5 6.5 2 12 2Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
}
