const mongoose = require('mongoose');

// Conexión a MongoDB Atlas
const dbUrl = 'mongodb+srv://jchipayo:chipayo1996@cluster0.jpiyntr.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB Atlas:', error));

// Esquema de ubicación
const locationSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Location = mongoose.model('Location', locationSchema);

// Función para manejar las solicitudes de ubicación
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { deviceId, lat, lng } = req.body;

    const location = new Location({ deviceId, lat: parseFloat(lat), lng: parseFloat(lng) });

    try {
      await location.save();
      res.status(201).send('Ubicación guardada');
    } catch (error) {
      res.status(500).send('Error al guardar la ubicación');
      console.error(error);
    }
  } else if (req.method === 'GET') {
    try {
      const locations = await Location.find();
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).send('Error al obtener las ubicaciones');
      console.error(error);
    }
  }
};
