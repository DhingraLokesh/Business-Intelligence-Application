import { useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  deleteProjectUser,
  getProjectUser,
  updateProjectUserRole,
} from "../../../redux/slices/projectSlice";
import { confirmAlert, normalAlert } from "../../../utils/Swal";

function UserTable() {
  const dispatch = useDispatch();
  const { allProjectUsers, projectUser } = useSelector(
    (state) => state.project
  );

  const [selectedUser, setSelectedUser] = useState({
    userId: null,
    role: null,
  });

  const options = [
    {
      value: "commentor",
      label: "commentor",
    },
    {
      value: "editor",
      label: "editor",
    },
    {
      value: "viewer",
      label: "viewer",
    },
  ];

  const handleUpdate = (user) => {
    confirmAlert(
      `Do you want to update the role of ${user.user.username}?`,
      "",
      "question",
      true,
      "Update"
    ).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateProjectUserRole({
            projectId: user.project,
            userId: user.user.id,
            role: selectedUser.role,
          })
        );
        normalAlert("Role Updated!", "", "success");
        dispatch(getProjectUser(user.project));
      }
    });
  };

  const handleDelete = (user) => {
    confirmAlert(
      `Do you want to delete the ${user.user.username} from project?`,
      "",
      "question",
      true,
      "Delete"
    ).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteProjectUser({
            projectId: user.project,
            userId: user.user.id,
          })
        );
        normalAlert("Deleted!", "", "success");
        dispatch(getProjectUser(user.project));
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
        <tr className="text-center">
          <th>Sr.No.</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          {projectUser?.data?.role === "owner" && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {allProjectUsers?.data?.map((user, index) => (
          <tr className="text-center">
            <td>{index + 1}</td>
            <td>{user.user.firstName}</td>
            <td>{user.user.lastName}</td>
            <td>{user.user.username}</td>
            <td>{user.user.email}</td>
            <td width="15%">
              {user.role === "owner" ? (
                "owner"
              ) : projectUser?.data?.role === "owner" ? (
                <Select
                  defaultValue={options.filter(
                    (option) => option.value === user.role
                  )}
                  options={options}
                  onChange={(e) => {
                    setSelectedUser({
                      userId: user.user.id,
                      role: e.value,
                    });
                  }}
                />
              ) : (
                user.role
              )}
            </td>
            {projectUser?.data?.role === "owner" && (
              <td className="d-flex justify-content-around">
                {user.role === "owner" ? (
                  "No Actions"
                ) : (
                  <>
                    {selectedUser.userId === user.user.id &&
                      selectedUser.role !== user.role && (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleUpdate(user)}
                        >
                          Update
                        </Button>
                      )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserTable;
