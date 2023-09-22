import formidable from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const form = new formidable.IncomingForm();
  form.on("fileBegin", function(name, file){
      file.path = path.join("./public/uploads", file.name)
  })
  form.parse(req, (err, fields, files) => {
    console.log(err, fields);
  });
};