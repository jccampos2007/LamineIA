const { validationResult } = require("express-validator");
const doc = require("../documentation.json");

async function index(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.send({
      code: 400,
      message: "Validation Errors",
      errors: errors.array(),
    });
  res.send("{code:200,message:'wschatgptdev ....!'}");
}

async function documentation(req, res) {
  res.status(200).json(doc);
}

module.exports = {
  index,
  documentation
};
