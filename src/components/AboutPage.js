import React from 'react';

class AboutPage extends React.Component {
    render() {
        document.documentElement.scroll(0, 0);
        return (
            <div>
                <div className="page-header">
                    <h1 className="content-container page-header__title"></h1>
                </div>
                <div className="content-container">
                    <p>See the source code: <a href="">GitHub repo</a></p>
                    <span>
                        Intro paragraph
                    </span>
                    <ul className="additions-list">
                        <li className="additions-list-section"></li>
                            <ul className="additions-list__sub">
                                <li>Subsection</li>
                                    <ul className="additions-list__sub__sub">
                                        <li className="additions-list-item"></li>
                                        <li className="additions-list-item"></li>
                                        <li className="additions-list-item"></li>
                                    </ul>
                            </ul>       
                    </ul>
                </div>
            </div>
        )
    }
}

export default AboutPage;