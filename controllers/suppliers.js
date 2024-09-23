const { Supplier } = require('../models');
const validateSupplier = require('../validation/supplierValidation');
const { Op } = require('sequelize');

module.exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.createSupplier = async (req, res) => {
  const { error } = validateSupplier(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(err => err.message) });
  }

  const supplierData = req.body;
  try {
    const createdSupplier = await Supplier.create(supplierData);
    res.status(201).json(createdSupplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findOne({  where: { uuid: id }, });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { error } = validateSupplier(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(err => err.message) });
  }

  const {
    suppliers,
    itemDescription,
    amountClaimed,
    approver,
    dateTakenToApprover,
    dateTakenToFinance,
    type,
    PvNo,
    claimNumber,
    accounted,
    dateAccounted,
  } = req.body;

  try {
    const supplier = await Supplier.findOne({  where: { uuid: id }, });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await supplier.update({
      suppliers: suppliers || supplier.suppliers,
      itemDescription: itemDescription || supplier.itemDescription,
      amountClaimed: amountClaimed || supplier.amountClaimed,
      approver: approver || supplier.approver,
      dateTakenToApprover: dateTakenToApprover || supplier.dateTakenToApprover,
      dateTakenToFinance: dateTakenToFinance || supplier.dateTakenToFinance,
      type: type || supplier.type,
      PvNo: PvNo || supplier.PvNo,
      claimNumber: claimNumber || supplier.claimNumber,
      accounted: accounted !== undefined ? accounted : supplier.accounted,
      dateAccounted: dateAccounted || supplier.dateAccounted,
    });

    res.status(200).json({ message: "Supplier information successfully updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.search = async (req, res) => {
  try {
    const { PvNo, claimNumber, amountClaimed, suppliers } = req.query;
    const conditions = {};

    if (PvNo) conditions.PvNo = { [Op.like]: `%${PvNo}%` };
    if (claimNumber) conditions.claimNumber = { [Op.like]: `%${claimNumber}%` };
    if (amountClaimed) conditions.amountClaimed = amountClaimed;
    if (suppliers) conditions.suppliers = { [Op.like]: `%${suppliers}%` };

    const foundSuppliers = await Supplier.findAll({ where: conditions });

    res.status(200).json(foundSuppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
  
    try {
      const supplier = await Supplier.findOne({  where: { uuid: id }, });
      if (supplier) {
        await supplier.destroy();
        res.status(200).json({ message: "Supplier record successfully deleted" });
      } else {
        res.status(404).json({ message: 'Supplier not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };