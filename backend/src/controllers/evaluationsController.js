const EvaluationsController = {};

import EvaluationsModel from "../models/Reviews.js";

// SELECT
EvaluationsController.getEvaluations = async (req, res) => {
  const evaluations = await EvaluationsModel.find().populate("idCustomers")
  res.json(evaluations);
};

// INSERT
EvaluationsController.insertEvaluations= async (req, res) => {
  const { comment, grade, role, idCustomers } = req.body;
  const newEvaluation = new EvaluationsModel({ comment, grade, role, idCustomers });
  await newEvaluation.save();
  res.json({ message: "Evaluations saved" });
};

// DELETE
EvaluationsController.deleteEvaluations = async (req, res) => {
  await EvaluationsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Evaluations deleted" });
};

// UPDATE
EvaluationsController.updateEvaluations = async (req, res) => {
  const { comment, grade, role, idCustomer } = req.body;
  await EvaluationsModel.findByIdAndUpdate(
    req.params.id,
    {
    comment, 
    grade, 
    role, 
    idCustomer
    },
    { new: true }
  );
};

export default EvaluationsController;
