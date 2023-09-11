import React from "react";
import "../styles/Card.css";
import { CardProps } from "../types/componentTypes";

const Card: React.FC<CardProps> = ({ title, className, style, children }) => {
  return (
    <div className={`card ${className ? className : ""}`} style={style}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
