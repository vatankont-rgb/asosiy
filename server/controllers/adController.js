const adRepository = require('../repositories/adRepository');

exports.getAllAds = async (req, res, next) => {
  try {
    const ads = await adRepository.getAll();
    res.json({ ads });
  } catch (err) {
    next(err);
  }
};

exports.createAd = async (req, res, next) => {
  try {
    const newAd = await adRepository.create(req.body);
    res.status(201).json({ message: 'Reklama muvaffaqiyatli qo\'shildi', ad: newAd });
  } catch (err) {
    next(err);
  }
};

exports.updateAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await adRepository.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Reklama topilmadi' });
    }
    res.json({ message: 'Reklama yangilandi', ad: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await adRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Reklama topilmadi' });
    }
    res.json({ message: 'Reklama o\'chirildi' });
  } catch (err) {
    next(err);
  }
};
