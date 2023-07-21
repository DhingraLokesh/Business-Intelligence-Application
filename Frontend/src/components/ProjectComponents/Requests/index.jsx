import React, { useEffect, useState } from "react";

// react-bootstrap components
import { Card, Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import Loader from "../../Loader";
import { useDispatch, useSelector } from "react-redux";
import RequestTable from "./RequestTable";
import {
  getAllRequests,
  receiveSocketRequest,
} from "../../../redux/slices/requestSlice";
import { getUser } from "../../../redux/slices/authSlice";
import socket from "../../../utils/socket";

function Requests() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const { user } = useSelector((state) => state.auth);
  const { allRequests } = useSelector((state) => state.request);

  const [key, setKey] = useState(true);

  const handleRequestFromServer = (request) => {
    setKey(false);
    dispatch(receiveSocketRequest(request));
  };

  useEffect(() => {
    if (!user?.data?.id) {
      dispatch(getUser());
    }

    socket.connect();
    socket.emit("joinRequestRoom", user?.data?.id);

    dispatch(getAllRequests());

    socket.on("requestFromServer", handleRequestFromServer);

    return () => {
      socket.off("requestFromServer", handleRequestFromServer);
    };
  }, [dispatch, user]);

  return (
    <>
      {allRequests.loading ? (
        <Loader message={allRequests.loadingMessage} />
      ) : (
        <Container fluid>
          <Row>
            <Col md="12">
              <Card className="card-user mt-4">
                <Card.Header>
                  <Card.Title as="h4">All Requests</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Tabs
                    defaultActiveKey="Sent"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3"
                    onSelect={(k) => setKey(k === "Sent")}
                    activeKey={key ? "Sent" : "Received"}
                  >
                    <Tab eventKey="Sent" title="Sent" />
                    <Tab eventKey="Received" title="Received" />
                  </Tabs>

                  <RequestTable
                    data={
                      key
                        ? allRequests.sentRequests
                        : allRequests.receivedRequests
                    }
                    isSent={key}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Requests;
