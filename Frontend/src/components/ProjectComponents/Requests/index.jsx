import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRequests,
  receiveSocketRequest,
} from "../../../redux/slices/requestSlice";
import { getUser } from "../../../redux/slices/authSlice";
import RequestTable from "./RequestTable";
import socket from "../../../utils/socket";
import Loader from "../../Loader";

function Requests() {
  const dispatch = useDispatch();

  const [key, setKey] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { allRequests } = useSelector((state) => state.request);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
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

  const handleRequestFromServer = (request) => {
    setKey(false);
    dispatch(receiveSocketRequest(request));
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-user mt-4">
              <Card.Header>
                <Card.Title as="h4">All Requests</Card.Title>
              </Card.Header>
              <Card.Body>
                {allRequests.loading ? (
                  <Container fluid>
                    <Row>
                      <Col md="12">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "400px",
                          }}
                        >
                          <Loader message={allRequests.loadingMessage} />
                        </div>
                      </Col>
                    </Row>
                  </Container>
                ) : (
                  <>
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
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Requests;
