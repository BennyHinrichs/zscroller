import React from 'react';
import data from '../fixtures/page-data';

export default class ZFrame extends React.Component {
    constructor(props) {
        super();
    }

    handleOnClick = () => {
        // const scrollTop = document.documentElement.scrollTop;
        const currentPage = document.getElementById(this.props.id);
        const scrollOut = (e) => {
            currentPage.parentNode.scrollTop = 0;
            currentPage.classList.remove('active');
            this.props.hasScrolledToFalse();
            setTimeout(() => {
                currentPage.parentNode.removeEventListener('scroll', scrollOut);
                document.body.classList.remove('stop-scrolling');}, 300);
        }
        document.body.classList.add('stop-scrolling');
        this.props.hasScrolledToTrue();
        currentPage.classList.add('active');
        currentPage.parentNode.addEventListener('scroll', scrollOut)
    }
    render() {
        return (
            <div className="page">
                <div className="zframe zframe--frame"></div>
                <div 
                    className="zframe zframe--content" 
                    id={this.props.id} 
                    style={{'backgroundImage': `url(/images/${data[this.props.id].imgSrc}.jpg)`}}
                    onClick={this.handleOnClick}
                >
                    {data[this.props.id].content && <div className="content">{data[this.props.id].content}</div>}
                    <div className="overlay-text">
                        <h1>{data[this.props.id].overlayTitle}</h1>
                        <p>{data[this.props.id].overlaySubtitle}</p>
                    </div>
                </div>
            </div>
        )
    }
}