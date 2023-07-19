import React, { useEffect, useState } from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Tab,
  Tabs,
} from "react-bootstrap";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import RequestTable from "./RequestTable";
import { getAllRequests } from "../../redux/slices/requestSlice";

function Requests() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRequests());
  }, []);

  const { allRequests } = useSelector((state) => state.request);

  const [key, setKey] = useState(true);

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
