const mongoose = require("mongoose");

const ProjectVectorSchema = new mongoose.Schema({
  companyRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyDetail",
    required: true,
    index: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  content: { type: String, required: true },
  embedding: { type: [Number], required: true },
});

const ProjectVector = mongoose.model("ProjectVector", ProjectVectorSchema);
module.exports = { ProjectVector };