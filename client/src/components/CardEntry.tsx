import React from "react";
import "./CardEntry.css";


interface CardProps {
    title: string;
    content: string;
    status: string;
}



const Card: React.FC<CardProps> = ({ title, content, status }) => {
    return (
        <div className={`card ${status}`}>
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    )
}

export default Card