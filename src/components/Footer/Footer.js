import React from "react";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-black footer">
            <div className="footer-upper pt-4 pb-2 position-relative">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-lg-4 white-border-right">
                            <div className="footer-content-item">
                                <div className="footer-logo">
                                    <Link to="/" onClick={() => {window.location.href="/"}}>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <img src="images/logo.png" alt="logo" className="logo logo-image"/>
                                        </div>
                                    </Link>
                                </div>
                                <div className="footer-details">
                                    <p className="text-white">
                                        FOLLOW US ON
                                    </p>
                                    <ul className="social-list social-list-btn">
                                        <li>
                                            <a href="https://www.linkedin.com/company/evaluationz-india-pvt-ltd/?viewAsMember=true" target="_blank" name="linkedin"><i className="mdi mdi-linkedin"></i></a>
                                        </li>
                                        <li>
                                            <a href="https://www.facebook.com/Evaluationz-212093105791989" target="_blank" name="facebook"><i className="mdi mdi-facebook"></i></a>
                                        </li>
                                    </ul>

                                    <div className="footer-copyright-text pt-3 footer-copyright-text-white">
                                        <p><a href="https://www.evaluationz.com/privacy" target="_blank">Privacy Policy</a> | <a href="https://www.evaluationz.com/faq" target="_blank">FAQ's</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 white-border-right">
                            <div className="footer-content-list footer-content-item desk-pad-left-70">
                                <div className="footer-content-title">
                                    <h3>QUICK LINKS</h3>
                                </div>
                                <ul className="footer-details footer-list">
                                    <li>
                                        <div className="row">
                                            <div className="col">
                                                <a href="https://www.evaluationz.com/services" target="_blank">SERVICES</a>
                                            </div>
                                            <div className="col">
                                                <a href="https://www.evaluationz.com/case-studies" target="_blank" className="no-wrap text-uppercase">Case Studies</a>
                                            </div>
                                            <div className="col">
                                                <a href="https://www.evaluationz.com/technology" target="_blank">TECHNOLOGY</a>
                                            </div>
                                            <div className="col">
                                                <a href="https://www.evaluationz.com/about-us" target="_blank">ABOUT</a>
                                            </div>
                                            <div className="col">
                                                <a href="https://www.evaluationz.com/careers" target="_blank">CAREERS</a>
                                            </div>
                                            <div className="col">
                                                <a href="https://www.evaluationz.com/contact" target="_blank">CONTACT</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="footer-content-list footer-content-item desk-pad-left-70">
                                <div className="footer-content-title">
                                    <h3>ADDRESS</h3>
                                </div>
                                <div className="footer-details footer-address">
                                    <div className="footer-address-item">
                                        <div className="footer-address-text">
                                            <p>Evaluationz India Private Limited,<br/>
                                                BHIVE Workspace, 29 MG Road,<br/>
                                                7th Floor-Mahalaxmi Chambers,<br/>
                                                Next to Trinity Metro Station,<br/>
                                                Bangalore - 560001</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
