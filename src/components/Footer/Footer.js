import React from "react";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-black footer">
            <div className="footer-upper pt-4 pb-2 position-relative">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="footer-content-item">
                                <div className="footer-logo">
                                    <Link to="/" onClick={() => {window.location.href="/"}}>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <img src="images/logo.png" alt="logo" className="logo logo-image"/>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="footer-content-list footer-content-item">
                                <div className="footer-content-title">
                                    <h3>ADDRESS</h3>
                                </div>
                                <div className="footer-details footer-address">
                                    <div className="footer-address-item">
                                        <div className="footer-address-text">
                                            <p>Evaluationz India Private Limited,<br/>
                                                BHIVE Workspace, 29 MG Road, 7th Floor-Mahalaxmi Chambers, Next to Trinity Metro Station, Bangalore - 560001</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="footer-content-list footer-content-item mb-0">
                                <p className="font-normal f-12 mb-0 text-white">Copyright ©2021 Evaluationz India Private Limited. Designed &amp; Developed By <a href="https://www.evaluationz.com/" target="_blank" className="text-decoration-none">Evaluationz</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
