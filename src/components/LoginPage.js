import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth';

/* *******TODO******* */
/*  1. Notify user to open in browser when using a native app: 
/*      document.addEventListener("deviceready", onDeviceReady, false);
        https://stackoverflow.com/questions/28940373/javascript-detect-mobile-embedded-browsers-captive-portal/30035311#30035311
/* ****************** */

export const LoginPage = ({ startLogin }) => (
    <div className="box-layout">
        <div className="box-layout__buffer">
            <div className="box-layout__box">
                <div className="show-for-mobile">
                    <img src="/images/logo.png" className="box-layout__logo box-layout__logo--small" />
                    <p className="form__error login-font">Tagline</p>
                </div>
                <div className="show-for-large">
                    <img src="/images/logoSubtitle.png" className="box-layout__logo box-layout__logo--large" />
                </div>
                <button className="button button--login" onClick={startLogin}>
                    <img src="/images/googleIcon.png" className="button--login__icon" />
                    <span className="button--login__text">Login with Google</span>
                </button>
            </div>
        </div>
    </div>
);

const mapDispatchToProps = (dispatch) => ({
    startLogin: () => dispatch(startLogin())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);