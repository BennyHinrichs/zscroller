import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';
import ZFrame from './components/ZFrame';
import data from './fixtures/page-data';
// import scrollSnap from './actions/scrollSnap';

let body, container, pageCount, pages;
let docHeight, pageHeight;
let resizeScroll, scrollTop, currentPage, scrollStart;
let pageTop, scrollDirection = 0;
let transitionTime, timeElapsed, timeStart;

export default class ZScroller extends React.Component {
    state = {
        hasScrolled: false
    };

    setHeight = () => {
            docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, 
                document.documentElement.scrollHeight, document.documentElement.offsetHeight);
            pageHeight = docHeight / pageCount
        };
    setScrollTop = () => { scrollTop = document.documentElement.scrollTop };
    setCurrentPage = () => { currentPage = Math.round(scrollTop / docHeight * pageCount) };
    setPageTop = () => { pageTop = pages[currentPage + scrollDirection].offsetTop };
    setTransitionTime = () => {
        // damping function based off viewport height
        transitionTime = pageHeight * (1 + 2 * Math.exp(-0.003 * pageHeight));
    }

    // TODO: add a scroll tolerance for mobile
    componentDidMount() {
        body = document.getElementById('body');
        container = document.getElementsByClassName('container')[0];
        pageCount = container.childElementCount;
        pages = container.children;
        this.setHeight();
        this.setScrollTop();
        this.setCurrentPage();
        this.setPageTop();
        this.setTransitionTime();
        window.addEventListener('scroll', this.scrollSnap);
        window.addEventListener('resize', this.handleResize);
    };

    handleResize = (e) => {
        resizeScroll = e.type;
        scrollDirection = 0;
        this.setPageTop();
        window.scrollTo(0, pageTop);
        this.setScrollTop(); // prevents decoupling from scrollSnap on risize of last page
        // adjust transition time based off height of viewport
        this.setHeight();
        this.setTransitionTime();
    }

    scrollSnap = () => {
        // scroll is broken if you scroll quickly
        // scroll is broken if you switch quickly between up and down
        // scroll is broken for viewports smaller than ~230px
        if (resizeScroll === 'resize') { resizeScroll = null; return; }
        if (this.state.hasScrolled) return;
        // stop scrolling inputs (hopefully)
        body.classList.add('stop-scrolling');
        // determine up, down, or neither
        if (scrollTop > document.documentElement.scrollTop && currentPage !== 0) {
            scrollDirection = -1;
            scrollTop = document.documentElement.scrollTop;
        } else if (scrollTop < document.documentElement.scrollTop && currentPage + 1 !== pageCount) {
            scrollDirection = 1;
            scrollTop = document.documentElement.scrollTop;
        } else {
            scrollDirection = 0;
            body.classList.remove('stop-scrolling');
            return;
        };
        // set values
        scrollStart = window.pageYOffset;
        this.setPageTop();
        this.setHeight();
        this.setCurrentPage();
        // animate
        requestAnimationFrame((time) => { timeStart = time; this.scrollLoop(time); });
        // release scroll
        setTimeout(() => body.classList.remove('stop-scrolling'), transitionTime); 
    }

    // animation utils, adapted from https://github.com/sitepoint-editors/smooth-scrolling/blob/gh-pages/jump.js
    scrollLoop = (time) => {
        this.setState({ hasScrolled: true });
        timeElapsed = time - timeStart;
        let step = this.easeInOutCos(timeElapsed, scrollStart, pageHeight, transitionTime);
        window.scrollTo(0, step);
        if (pageTop - 1 < window.pageYOffset && scrollDirection === 1) {
            this.scrollStop();
        } else if (pageTop + 1 > window.pageYOffset && scrollDirection === -1) {
            this.scrollStop();
        } else if (timeElapsed < transitionTime) {
            requestAnimationFrame(this.scrollLoop);
        } else {
            this.scrollStop();
        }
    };s
    easeInOutCos = (t, b, c, d) => {
        const upOrDown = scrollDirection * -1;
        return upOrDown * c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
    scrollStop = () => {
        window.scrollTo(0, pageTop);
        this.setState({ hasScrolled: false });
    };

    hasScrolledToFalse = () => this.setState({ hasScrolled: false });
    hasScrolledToTrue = () => this.setState({ hasScrolled: true });

    render() {
        return (
            <div className="container">
                {
                    data.map((datum, index) => (
                        <ZFrame
                            key={datum.imgSrc}
                            id={index}
                            pageTop={pageTop}
                            setPageTop={this.setPageTop}
                            hasScrolledToFalse={this.hasScrolledToFalse}
                            hasScrolledToTrue={this.hasScrolledToTrue}
                            body={body}
                        />
                    ))
                }
            </div>
        );
    } 
}

ReactDOM.render(<ZScroller />, document.getElementById('app'));