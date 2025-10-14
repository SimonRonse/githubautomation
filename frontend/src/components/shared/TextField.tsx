import React from "react";

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
                                  }: Props) {
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

            {helper && <p className="helper">{helper}</p>}
        </div>
    );
}
