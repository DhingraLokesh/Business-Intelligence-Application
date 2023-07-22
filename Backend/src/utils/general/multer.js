import multer from "multer";
import path from "path";

// this file contains all the util functions to handle file upload and serve it statically

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(path.dirname(new URL(import.meta.url).pathname), "../../upload")
    );
  },
  filename: function (req, file, cb) {
    const extension = (file.mimetype.includes("image")) ? ".png" :
    path.extname(file.originalname);
    const newFileName = `${
      req.params.projectId || req.loggedInUserId
    }${extension}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

const uploadFile = (req, res, fileName) => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        const uploadedFile = req.file;
        const extension = uploadedFile.originalname.split(".").pop();
        const newFileName = `${fileName}.${extension}`;
        const renamedFile = { ...uploadedFile, filename: newFileName };
        resolve(renamedFile);
      }
    });
  });
};

export { uploadFile, upload };
