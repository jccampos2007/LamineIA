const { validationResult } = require('express-validator');
const model = require('./model');
const { query } = require('express');
 

    async function getOne(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ code: 400, message: 'Validation Errors', errors: errors.array() });
        let out = await model.getOne(req.query, req);    
        res.status(out.code).json(out);           
    }
  
    async function add(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ code: 400, message: 'Validation Errors', errors: errors.array() });
        let out = await model.add(req.body);     
        res.status(out.code).json(out);     
    }
  
    async function update(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ code: 400, message: 'Validation Errors', errors: errors.array() });
        let out = await model.update(req.body);     
        res.status(out.code).json(out);     
    }

    async function deleted(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ code: 400, message: 'Validation Errors', errors: errors.array() });
        let out = await model.deleted(req.query, req);    
        res.status(out.code).json(out);           
    }
    
    async function getAll(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ code: 400, message: 'Validation Errors', errors: errors.array() });
        let out = await model.getAll(req.query, req);    
        res.status(out.code).json(out);           
    }

module.exports = {
    getAll,
    getOne,
    add,
    update,
    deleted
} 