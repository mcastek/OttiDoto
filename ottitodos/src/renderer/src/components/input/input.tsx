import type { InputHTMLAttributes } from "react";
import "./input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    labelName?: string;
    error?: string;
}

export default function Input({
    name,
    labelName,
    error,
    ...props
}: InputProps) {
    return (
        <div className="input_container">
            <label htmlFor={name}>{labelName}</label>
            <input name={name} {...props} />
        </div>
    );
}
