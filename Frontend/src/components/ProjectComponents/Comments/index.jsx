import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  addComment,
  addCommentSocket,
  getAllComments,
} from "../../../redux/slices/commentSlice";
import { getProjectUser } from "../../../redux/slices/projectSlice";
import Loader from "../../Loader";
import socket from "../../../utils/socket";
import "../../../assets/css/styles.css";

const Comments = ({ onClose }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { allComments, newComment } = useSelector((state) => state.comment);
  const { projectUser } = useSelector((state) => state.project);

  const [comment, setComment] = useState("");

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const projectId = location.pathname.split("/")[2];

    const handleCommentFromServer = (request) => {
      dispatch(addCommentSocket(request));
    };

    socket.connect();
    socket.emit("joinCommentRoom", projectId);

    dispatch(getAllComments(projectId));
    dispatch(getProjectUser(projectId));

    socket.on("commentFromServer", handleCommentFromServer);

    return () => {
      socket.off("commentFromServer", handleCommentFromServer);
    };
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [onClose]);

  const sidebarRef = useRef(null);

  const handleInputChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (comment.trim() !== "") {
      setComment("");
      const projectId = location.pathname.split("/")[2];
      await dispatch(
        addComment({
          projectId,
          message: comment.trim(),
        })
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <div ref={sidebarRef} className="comment-sidebar right">
      <div className="comment-sidebar-header">
        <h3 className="comment-sidebar-title">Comment Section</h3>
        <h5
          className="close p-2"
          onClick={onClose}
          style={{
            cursor: "pointer",
            backgroundColor: "#f5f5f5",
          }}
        >
          x
        </h5>
      </div>
      <div
        className="comment-sidebar-content"
        style={{
          overflow: "auto",
        }}
      >
        <div
          style={{
            overflowY: "auto",
            height: "80%",
          }}
        >
          <ul className="list-group">
            {allComments?.loading || newComment?.loading ? (
              <Loader
                message={
                  allComments?.loadingMessage || newComment?.loadingMessage
                }
              />
            ) : allComments?.data?.length === 0 ? (
              <h3
                className="comment-sidebar-title"
                style={{
                  textAlign: "center",
                  marginTop: "50%",
                }}
              >
                No comments to display !!
              </h3>
            ) : (
              allComments?.data?.map((comment, index) => (
                <li className="list-group-item my-1" key={index}>
                  <div className="d-flex justify-content-between">
                    <strong
                      style={{
                        overflowWrap: "break-word",
                        width: "50%",
                      }}
                    >
                      {comment.user.username}
                    </strong>
                    <div
                      className="comment-time"
                      style={{
                        fontSize: "0.7rem",
                      }}
                    >
                      {new Date(comment.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        daySuffix: "long",
                      })}
                    </div>
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      overflowWrap: "break-word",
                    }}
                  >
                    {comment.message}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {projectUser?.data?.role !== "viewer" && (
          <form
            onSubmit={handleSubmit}
            className="comments-form-inline mt-auto comment-form"
          >
            <div className="comment-input-group">
              <input
                type="text"
                className="comments-form-control"
                placeholder="Enter your comment..."
                value={comment}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className="btn btn-primary mb-4 btn-sm"
                disabled={comment.trim() === ""}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Comments;
