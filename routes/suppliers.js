const { Router } = require('express');
const { Supplier } = require('../models');
const { 
  getSuppliers, 
  createSupplier, 
  getSupplierById, 
  search, 
  updateSupplier, 
  deleteSupplier 
} = require('../controllers/suppliers');

const supplierRouter = Router();

supplierRouter.get('/', getSuppliers);
supplierRouter.post('/', createSupplier);
supplierRouter.get('/:id', getSupplierById);
supplierRouter.post('/search', search);
supplierRouter.patch('/:id/update', updateSupplier);
supplierRouter.get('/:id/delete', deleteSupplier);

module.exports = supplierRouter;