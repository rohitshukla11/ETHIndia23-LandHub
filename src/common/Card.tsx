import React, { Fragment } from 'react';
import "./Card.css"

interface ModalProps {
    title: string;
    imgSrc:any;
}

const Card: React.FC<ModalProps> = ({ title,imgSrc }) => {
    return (
        <>
            <div className="inner-card">
                <div className="header">
                    <div className="img-box">
                    <img src={imgSrc} style={{ height: '100%',width:'100%' }} />
                    </div>
                    <span className="title">{title}
                    </span></div>
            </div>
        </>
    );
};

export default Card;
