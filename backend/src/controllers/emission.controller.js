import emissionService from '../services/emission.service.js';

export const getMasterItems = async (req, res) => {
  try {
    const data = await emissionService.getMasterItems();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateEmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const result = await emissionService.calculateAndSaveEmission(userId, items);

    res.status(201).json({
      success: true,
      message: 'Kalkulasi emisi berhasil dihitung dan disimpan!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};