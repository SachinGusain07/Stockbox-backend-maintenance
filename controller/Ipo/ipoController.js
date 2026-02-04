import Ipos from '../../models/IPOModel.js';

export const createIpo = async (req, res) => {
  try {
    const ipo = new Ipos(req.body);
    await ipo.save();
    res.status(201).json(ipo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllIpos = async (req, res) => {
  try {
    const ipos = await Ipos.find();
    res.json(ipos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteIpo = async (req, res) => {
  try {
    const ipo = await Ipos.findByIdAndDelete(req.params.id);
    if (!ipo) {
      return res.status(404).json({ error: 'IPO not found' });
    }
    res.json({ message: 'IPO deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateIpo = async (req, res) => {
  try {
    const ipo = await Ipos.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!ipo) {
      return res.status(404).json({ error: 'IPO not found' });
    }

    res.json(ipo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};