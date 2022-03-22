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
                                        {/*<li>
                                            <Link to={{pathname: "https://www.twitter.com/"}} target="_blank" name="facebook"><i className="mdi mdi-twitter"></i></Link>
                                        </li>*/}
                                        <li>
                                            <Link to={{pathname: "https://www.linkedin.com/company/evaluationz-india-pvt-ltd/?viewAsMember=true"}} target="_blank" name="linkedin"><i className="mdi mdi-linkedin"></i></Link>
                                        </li>
                                        <li>
                                            <Link to={{pathname: "https://www.facebook.com/Evaluationz-212093105791989"}} target="_blank" name="facebook"><i className="mdi mdi-facebook"></i></Link>
                                        </li>
                                    </ul>

                                    <div className="footer-copyright-text pt-3 footer-copyright-text-white">
                                        <p>{/*<Link to="/tnc">Terms of Use</Link> | */}<Link to="/privacy" target="_blank">Privacy Policy</Link>{/* | <Link to="/cookie">Cookie Policy</Link>*/} | <Link to="/faq" target="_blank">FAQ's</Link></p>
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
                                                <Link to="/services">SERVICES</Link>
                                            </div>
                                            <div className="col">
                                                <Link to="/case-studies" className="no-wrap text-uppercase">Case Studies</Link>
                                            </div>
                                            <div className="col">
                                                <Link to="/technology">TECHNOLOGY</Link>
                                            </div>
                                            <div className="col">
                                                <Link to="/about-us">ABOUT</Link>
                                            </div>
                                            <div className="col">
                                                <Link to="/careers">CAREERS</Link>
                                            </div>
                                            <div className="col">
                                                <Link to="/contact">CONTACT</Link>
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
                                            <p>Evaluationz India Private Limited<br/>
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

            <div className="scroll-top scrolltopactive" id="scrolltop">
                <div className="scroll-top-inner">
                    <i className="mdi mdi-arrow-up"></i>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
