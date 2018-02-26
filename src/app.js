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
let docHeight = 0, pageHeight = 0;
const setHeight = () => {
    docHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, document.documentElement.offsetHeight );
    pageHeight = docHeight / pageCount
};
setHeight();
// scroll location
let resizeScroll = null;
let hasScrolled = false;
let scrollTop = document.documentElement.scrollTop;
let currentPage = 0, scrollStart = window.pageYOffset;
const setCurrentPage = () => {currentPage = Math.round(scrollTop / docHeight * pageCount)};
setCurrentPage();
// top of page
let pageTop = 0, scrollDirection = 0;
const setPageTop = () => {pageTop = pages[currentPage + scrollDirection].offsetTop};
setPageTop();
// time variables
const transitionTime = 600;
let timeStart = 0, timeElapsed = 0;

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
}

const scrollSnap = () => {
    if (resizeScroll === 'resize') { resizeScroll = null; return; }
    if (hasScrolled) return;
    // stop scrolling inputs (hopefully)
    body.classList.add('stop-scrolling');
    // if (window.pageYOffset !== pageTop) {window.scrollTo(0, pageTop); return;}

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
window.addEventListener('scroll', scrollSnap);
// the scroll is broken for viewports smaller than ~230px
window.addEventListener('resize', handleResize);

// animation utils, adapted from https://github.com/sitepoint-editors/smooth-scrolling/blob/gh-pages/jump.js
const scrollLoop = (time) => {
    hasScrolled = true;
    timeElapsed = time - timeStart;
    window.scrollTo(0, easeInOutQuad(timeElapsed, scrollStart, pageHeight, transitionTime));
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

const easeInOutQuad = (t, b, c, d) => {
    const upOrDown = scrollDirection === 1 ? -1 : 1
    return upOrDown * c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};

const scrollStop = () => {
    window.scrollTo(0, pageTop);
    hasScrolled = false;
};