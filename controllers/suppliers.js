const { Supplier } = require('../models');
const validateSupplier = require('../validation/supplierValidation');
const { Op , Sequelize } = require('sequelize');
const Joi = require('joi');


const uuidSchema = Joi.string()
  .guid({ version: ['uuidv4'] })
  .required()
  .messages({
    'string.base': 'UUID must be valid.',
    'string.guid': 'UUID must be a valid UUID.',
    'any.required': 'UUID is required.'
  });

function getOperatorForType(type, value) {
  if (type instanceof Sequelize.STRING) {
    return { [Op.iLike]: `%${value}%` };
  } else if (type instanceof Sequelize.INTEGER || type instanceof Sequelize.FLOAT || type instanceof Sequelize.DOUBLE) {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? { [Op.eq]: null } : numValue;
  } else if (type instanceof Sequelize.BOOLEAN) {
    return value.toLowerCase() === 'true';
  } else if (type instanceof Sequelize.DATE) {
    return { [Op.eq]: new Date(value) };
  }
  // For other types, use equality
  return { [Op.eq]: value };
}

function isSearchableType(type) {
  return type instanceof Sequelize.STRING ||
         type instanceof Sequelize.INTEGER ||
         type instanceof Sequelize.FLOAT ||
         type instanceof Sequelize.DOUBLE ||
         type instanceof Sequelize.BOOLEAN ||
         type instanceof Sequelize.DATE;
}
module.exports.getSuppliers = async (req, res) => {
  try {
    const { q, filter, page = 0, size = 10 } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);

    // Get the actual column names and types from the Supplier model
    const attributes = Object.entries(Supplier.rawAttributes).map(([name, attribute]) => ({
      name,
      type: attribute.type
    }));

    let whereClause = {};
    let query = {};

    if (q) {
      if (filter && filter !== 'all' && attributes.some(attr => attr.name === filter)) {
        // If a specific filter is provided and it exists in the model
        const attribute = attributes.find(attr => attr.name === filter);
        whereClause[filter] = getOperatorForType(attribute.type, q);
      } else {
        // If no specific filter or 'all', search in all searchable fields
        whereClause[Op.or] = attributes
          .filter(attr => isSearchableType(attr.type))
          .map(attr => ({
            [attr.name]: getOperatorForType(attr.type, q)
          }));
      }
      query.where = whereClause;
    }

    // Always apply pagination and sorting
    query.order = [['createdAt', 'DESC']];
    query.limit = pageSize;
    query.offset = pageNumber * pageSize;

    const suppliers = await Supplier.findAndCountAll(query);

    res.status(200).json({
      content: suppliers.rows,
      count: suppliers.count,
      totalPages: Math.ceil(suppliers.count / pageSize)
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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