const { Router } = require('express');
const { upload } = require('../middleware/fileUploadMiddleware');
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
supplierRouter.post('/', upload, createSupplier);
supplierRouter.get('/:id', getSupplierById);
supplierRouter.post('/search', search);
supplierRouter.patch('/:id/update',upload, updateSupplier);
supplierRouter.get('/:id/delete', deleteSupplier);

module.exports = supplierRouter;