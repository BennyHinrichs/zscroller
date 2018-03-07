let hasScrolled = false, timeStart, timeElapsed;
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

// animation utils, adapted from https://github.com/sitepoint-editors/smooth-scrolling/blob/gh-pages/jump.js
export default (time) => {
    hasScrolled = true;
    timeElapsed = time - timeStart;
    let step = easeInOutCos(timeElapsed, scrollStart, pageHeight, transitionTime);
    window.scrollTo(0, step);
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