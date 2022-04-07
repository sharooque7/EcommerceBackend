const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//req.files.file.path
const upload = async (req, res, next) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`, //url
    resource_type: "auto", //jpeg,pg,
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};
const remove = async (req, res, next) => {
  let image_id = req.body.public_id;
  console.log(image_id);
  let result = await cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.status(201).send("ok");
  });
};

module.exports = { upload, remove };
