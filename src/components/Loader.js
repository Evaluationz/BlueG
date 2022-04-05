import React from "react";
import Container from "@material-ui/core/Container";

function Loader() {

    return (
        <>
            <Container fluid className="">
                <div className="spinner-block">
                    {/*<div className="spinner">
                        <div className="rect1"> </div>
                        <div className="rect2"> </div>
                        <div className="rect3"> </div>
                        <div className="rect4"> </div>
                        <div className="rect5"> </div>
                    </div>*/}

                    <div className="spinner">
                        <div className="spinner-item"> </div>
                        <div className="spinner-item"> </div>
                        <div className="spinner-item"> </div>
                        <div className="spinner-item"> </div>
                        <div className="spinner-item"> </div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Loader;
