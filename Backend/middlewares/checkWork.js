// checkWork.js

module.exports = (req, res, next) => {
  try {
    const BASE_URL = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    const title = req.body.title?.trim();
    const categoryId = parseInt(req.body.category);
    const userId = req.auth.userId;
    const filename = req.file?.filename;

    if (!filename) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `${BASE_URL}/images/${filename}`;

    console.log(title, categoryId, userId, imageUrl);

    if (
      title && title.length > 0 &&
      categoryId && categoryId > 0 &&
      userId && userId > 0 &&
      imageUrl
    ) {
      req.work = { title, categoryId, userId, imageUrl };
      next();
    } else {
      return res.status(400).json({ error: new Error("Bad Request") });
    }
  } catch (e) {
    return res.status(500).json({ error: new Error("Something wrong occured") });
  }
};