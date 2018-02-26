import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';

const jsx = (
    <div className="container">
        <div className="page" id="top"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"><a href="#top"></a></div></div>
    </div>
);
ReactDOM.render(jsx, document.getElementById('app'));

// html element info
const body = document.getElementById('body');
const container = document.getElementsByClassName('container')[0];
const pageCount = container.childElementCount;
const pages = container.children;
// document height
let docHeight, pageHeight;
const setHeight = () => {
    docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    pageHeight = docHeight / pageCount;
};
setHeight();
// scroll location
let resizeScroll = null, hasScrolled = false, scrollTop;
const setScrollTop = () => {scrollTop = document.documentElement.scrollTop};
setScrollTop();
let currentPage, scrollStart; // scrollStart is used in the scrollLoop function
const setCurrentPage = () => {currentPage = Math.round(scrollTop / docHeight * pageCount)};
setCurrentPage();
// top of page
let pageTop, scrollDirection = 0;
const setPageTop = () => {pageTop = pages[currentPage + scrollDirection].offsetTop};
setPageTop();
// time variables
let transitionTime;
const setTransitionTime = () => {
    // damping function based off viewport height
    transitionTime = pageHeight * (1 + 2 * Math.exp(-0.003 * pageHeight));
}
setTransitionTime();
let timeStart, timeElapsed;

// set up page with different divs
for (let i=1;i<=pageCount;i++) {
    const weight = Math.round(255 * i / pageCount);
    const page = document.querySelector(`.page:nth-child(${i})`);
    page.style.background = `rgb(${weight},${weight},${weight})`;
    page.children[0].innerHTML += `<a href="#top">${i}</a>`;
}

const handleResize = (e) => {
    resizeScroll = e.type;
    scrollDirection = 0;
    setPageTop();
    window.scrollTo(0, pageTop);
    setScrollTop(); // prevents decoupling from scrollSnap on risize of last page
    // adjust transition time based off height of viewport
    setHeight();
    setTransitionTime();
}

const scrollSnap = () => {
    // scroll is broken if you scroll quickly
    // scroll is broken if you switch quickly between up and down
    // scroll is broken for viewports smaller than ~230px
    if (resizeScroll === 'resize') { resizeScroll = null; return; }
    if (hasScrolled) return;
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
    setPageTop();
    setHeight();
    setCurrentPage();
    // animate
    requestAnimationFrame((time) => { timeStart = time; scrollLoop(time); });
    // release scroll
    setTimeout(() => body.classList.remove('stop-scrolling'), transitionTime);
    
}
// TODO: add a scroll tolerance for mobile
window.addEventListener('scroll', scrollSnap);
window.addEventListener('resize', handleResize);

// animation utils, adapted from https://github.com/sitepoint-editors/smooth-scrolling/blob/gh-pages/jump.js
const scrollLoop = (time) => {
    hasScrolled = true;
    timeElapsed = time - timeStart;
    window.scrollTo(0, easeInOutCos(timeElapsed, scrollStart, pageHeight, transitionTime));
    if (pageTop - 1 < window.pageYOffset && scrollDirection === 1) {
        scrollStop();
    } else if (pageTop + 1 > window.pageYOffset && scrollDirection === -1) {
        scrollStop();
    } else if (timeElapsed < transitionTime) {
        requestAnimationFrame(scrollLoop);
    } else {
        scrollStop();
    }
};

const easeInOutCos = (t, b, c, d) => {
    const upOrDown = scrollDirection * -1;
    return upOrDown * c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};

const scrollStop = () => {
    window.scrollTo(0, pageTop);
    hasScrolled = false;
};