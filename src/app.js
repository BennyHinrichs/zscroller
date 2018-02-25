import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';

const jsx = (
    <div className="container">
        <div className="page"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"></div></div>
        <div className="page"><div className="page page__content"></div></div>
    </div>
);
ReactDOM.render(jsx, document.getElementById('app'));

const body = document.getElementById('body');
const container = document.getElementsByClassName('container')[0];
const pageCount = container.childElementCount;
const pages = container.children;
// document height
let docHeight = 0;
const setDocHeight = () => {docHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, 
    document.documentElement.scrollHeight, document.documentElement.offsetHeight )};
setDocHeight();
// timeout for throttle
const transitionTime = 500;
let lastRun = 0;
// scroll location
let resizeScroll = null;
let scrollTop = document.documentElement.scrollTop;
let currentPage = 0;
const setCurrentPage = () => {currentPage = Math.round(scrollTop / docHeight * pageCount)};
setCurrentPage();
// top of page
let scrollDirection = 0;
let pageTop = 0;
const setPageTop = () => {pageTop = pages[currentPage + scrollDirection].offsetTop};
setPageTop();

// set up page with different divs
for (let i=1;i<=pageCount;i++) {
    const weight = Math.round(255 * i / pageCount);
    const page = document.querySelector(`.page:nth-child(${i})`);
    page.style.background = `rgb(${weight},${weight},${weight})`;
    page.children[0].innerHTML += i;
}

const handleResize = (e) => {
    resizeScroll = e.type;
    scrollDirection = 0;
    setPageTop();
    window.scrollTo(0, pageTop);
}

const scrollSnap = () => {
    if (resizeScroll === 'resize') {
        resizeScroll = null;
        return;
    }
    
    body.classList.add('stop-scrolling');
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
    }
    setPageTop();
    setDocHeight();
    setCurrentPage();
    window.scrollTo(0, pageTop);
    // console.log('scroll')
    setTimeout(() => body.classList.remove('stop-scrolling'), transitionTime);
}
window.addEventListener('scroll', scrollSnap);
// the scroll is broken for viewports smaller than ~230px
window.addEventListener('resize', handleResize);