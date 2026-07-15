import type { TextareaHTMLAttributes } from "react";
import "./text-area.css";

interface AreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    labelName: string;
    error?: string;
}

export default function TextArea({
    name,
    labelName,
    error,
    ...props
}: AreaProps) {
    return (
        <div className="textarea_container">
            <label htmlFor={name}>{labelName}</label>
            <textarea name={name} {...props} />
        </div>
    );
}
