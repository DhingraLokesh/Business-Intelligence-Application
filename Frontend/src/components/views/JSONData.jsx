import React from "react";
import { Table } from "react-bootstrap";

const JSONData = ({ data }) => {
  // Extracting the headers from the first object in the data array
  const headers = data?.length > 0 ? Object.keys(data[1]) : [];

  return (
    <div
      style={{
        maxHeight: "90%",
        overflow: "scroll",
      }}
    >
      <Table striped bordered>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              {headers.map((header, index) => (
                <td key={index}>{item[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default JSONData;
