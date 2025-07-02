const db = require('./models'); // adapte selon ton chemin
const Works = db.works;

const OLD_BASE_URL = 'http://localhost:5678';
const NEW_BASE_URL = 'https://portfolio-architecte-sophie-bluel-cx5e.onrender.com';

async function updateImageUrls() {
  try {
    await db.sequelize.authenticate();
    console.log('DB connected');

    const works = await Works.findAll();

    for (const work of works) {
      if (work.imageUrl && work.imageUrl.startsWith(OLD_BASE_URL)) {
        const newImageUrl = work.imageUrl.replace(OLD_BASE_URL, NEW_BASE_URL);
        work.imageUrl = newImageUrl;
        await work.save();
        console.log(`Updated work id=${work.id} imageUrl`);
      }
    }

    console.log('All image URLs updated.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating image URLs:', error);
    process.exit(1);
  }
}

updateImageUrls();