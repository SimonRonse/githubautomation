import React, {useState} from "react";

type Props = {
    id: string;
    label: string;
    type?: "text" | "email" | "password" | "token";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    helper?: string;
    linkLabel?: string;
    onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    copyable?: boolean;
};

export default function TextField({
                                      id,
                                      label,
                                      type = "text",
                                      value,
                                      onChange,
                                      placeholder,
                                      autoComplete,
                                      required = false,
                                      helper,
                                      linkLabel,
                                      onLinkClick,
                                      copyable = false,
                                  }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            alert("Failed to copy text.");
        }
    };
    return (
        <div className="form__group">
            <div className="text-field__row">
                <label htmlFor={id}>{label}</label>
                {linkLabel && (
                    <a
                        href="#"
                        className="helper"
                        onClick={(e) => {
                            e.preventDefault();
                            onLinkClick?.(e);
                        }}
                    >
                        {linkLabel}
                    </a>
                )}
            </div>
            <div className="text-field__input-wrapper">
                <input
                    id={id}
                    className="input"
                    type={type === "token" ? "text" : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                />

                {copyable && (
                    <button
                    type="button"
                    className="invite-url__copy-btn"
                    onClick={handleCopy}
                    aria-label="Copy invite link"
                    >
                        ⧉
                    </button>
                )}
            </div>

            {helper || copied ? (
                <p
                    className="helper"
                    style={{ color: copied ? "var(--focus)" : undefined }}
                >
                    {copied ? "Copied!" : helper}
                </p>
            ) : null}
        </div>
    );
}
