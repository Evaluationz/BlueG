import React from "react";
import Container from "@material-ui/core/Container";

function Loader() {

    return (
        <>
            <Container fluid="true" className="d-flex align-items-center justify-content-center loader-container">
                <p className="loader"> </p>
            </Container>
        </>
    );
}

export default Loader;
