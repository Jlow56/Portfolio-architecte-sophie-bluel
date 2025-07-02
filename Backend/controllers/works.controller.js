const db = require('./../models');
const Works = db.works

exports.findAll = async (req, res) =>  {
	const works = await Works.findAll({include: 'category'});
	return res.status(200).json(works);
}

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

exports.delete = async (req, res) => {
	try{
		await Works.destroy({where:{id: req.params.id}})
		return res.status(204).json({message: 'Work Deleted Successfully'})
	}catch(e){
		return res.status(500).json({error: new Error('Something went wrong')})
	}

}
