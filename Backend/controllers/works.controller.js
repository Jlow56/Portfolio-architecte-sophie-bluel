exports.create = async (req, res) => {
  try {
    const BASE_URL = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const title = req.body.title;
    const categoryId = req.body.category;
    const userId = req.auth.userId;
    const filename = req.file?.filename;

    if (!filename) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `${BASE_URL}/images/${filename}`;

    const work = await Works.create({
      title,
      imageUrl,
      categoryId,
      userId
    });

    return res.status(201).json(work);
  } catch (err) {
    return res.status(500).json({ error: new Error('Something went wrong') });
  }
};