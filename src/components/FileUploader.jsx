import React, { useMemo, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import request from "superagent";
import { base_url } from "../config.json";

//Andere aanpak mbv back-end: https://www.youtube.com/watch?v=srPXMt1Q0nY
//React dropzone: https://react-dropzone.js.org/
//Superagent package: https://www.npmjs.com/package/superagent
//Stackoverflow antwoord: https://stackoverflow.com/questions/39663961/how-do-you-send-images-to-node-js-with-axios
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  //display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: "auto",
  height: "20%",
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "100%",
  height: "auto",
};

function StyledDropzone(props) {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      uploadFile(files);
      console.log(`Files = ${JSON.stringify(acceptedFiles)}`);
    },
  });

  const uploadFile = (files) => {
    let uploadFile = new FormData();
    uploadFile.append("name", files[0]);
    let req = request.post(`${base_url}v0/images/`).send(uploadFile);
    req.end(function (err, res) {
      console.log("Upload done!");
    });
  };

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} alt={file.path} />
      </div>
    </div>
  ));

  const filenames = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some file here, or click to select a file</p>
        <em>(max 1 file)</em>
      </div>
      <aside>
        <h4>File</h4>
        <ul>{filenames}</ul>
        <div style={thumbsContainer}>{thumbs}</div>
      </aside>
    </div>
  );
}

export default function FileUploader() {
  return <StyledDropzone />;
}
