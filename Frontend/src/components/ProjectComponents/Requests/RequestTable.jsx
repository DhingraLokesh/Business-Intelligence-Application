import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch } from "react-redux";
import {
  getAllRequests,
  handleRequest,
} from "../../../redux/slices/requestSlice";
import { confirmAlert, normalAlert } from "../../../utils/Swal";

function UserTable(props) {
  const dispatch = useDispatch();
  
  const handleRequestChange = (req, isAccept) => {
    confirmAlert(
      `Do you want to ${
        isAccept ? "accept" : "reject"
      } the project joining request?`,
      "",
      "question",
      true,
      "Yes"
    ).then(async (result) => {
      if (result.isConfirmed) {
        normalAlert(isAccept ? "Accepted !" : "Rejected !", "", "success");

        const resp = await dispatch(
          handleRequest({
            requestId: req.id,
            isAccept: isAccept ? 1 : 0,
          })
        );

        if (resp.meta.requestStatus === "fulfilled") {
          dispatch(getAllRequests());
        }
      }
    });
  };

  return (
    <Table responsive>
      <thead
        style={{
          position: "sticky",
          top: "0",
        }}
      >
        {props.data?.length !== 0 && (
          <tr className="text-center">
            <th>Sr.No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Project Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        )}
      </thead>
      <tbody>
        {props.data?.map((req, index) => (
          <tr className="text-center">
            <td>{index + 1}</td>
            <td>{props.isSent ? req.to.firstName : req.from.firstName}</td>
            <td>{props.isSent ? req.to.lastName : req.from.lastName}</td>
            <td>{props.isSent ? req.to.username : req.from.username}</td>
            <td>{props.isSent ? req.to.email : req.from.email}</td>
            <td>{req.project.name}</td>
            <td>{req.role}</td>
            <td className="d-flex justify-content-around">
              {props.isSent ? (
                req.state
              ) : req.state === "pending" ? (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleRequestChange(req, true)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRequestChange(req, false)}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                req.state
              )}
            </td>
          </tr>
        ))}
        {props.data?.length === 0 && (
          <tr className="text-center">
            <h5 colSpan="7">No requests found</h5>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default UserTable;
