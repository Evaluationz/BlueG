import React from "react";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-black footer">
            <div className="footer-upper py-4 position-relative">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="footer-content-list footer-content-item mb-0">
                                <p className="font-normal f-12 mb-0 text-white">© 2022 BlueG by Evaluationz India Private Limited.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
