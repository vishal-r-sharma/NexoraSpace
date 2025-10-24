const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const companyAuth = require("../middleware/companyAuth")
const { CompanyEmployee } = require("../models/employee.model");
const { CompanyDetail } = require("../models/companyDetail.model");

// Force JSON for all responses
router.use((req, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

/* ------------------------------------------------------
   🧠 Multer TEMP Storage (always upload to temp)
------------------------------------------------------ */
const tempStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/temp");
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: tempStorage });

/* ------------------------------------------------------
   ✅ ADD EMPLOYEE (creates correct folder)
------------------------------------------------------ */
router.post("/add", companyAuth, upload.array("documents"), async (req, res) => {
  try {
    const { companyRef, name, email, position, project, status, joiningDate } = req.body;
    if (!companyRef || !name || !email || !position)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    // 🔹 Create company employee document (if not exists)
    let empDoc = await CompanyEmployee.findOne({ companyRef });
    if (!empDoc) empDoc = await CompanyEmployee.create({ companyRef, employees: [] });

    // 🔹 Create new employee
    empDoc.employees.push({
      name,
      email,
      position,
      project,
      status: status || "Active",
      joiningDate: joiningDate || new Date(),
      documents: [],
    });
    await empDoc.save();

    const newEmp = empDoc.employees[empDoc.employees.length - 1];

    // 🔹 Define correct folder path using employee ID
    const company = await CompanyDetail.findById(companyRef).lean();
    const companyFolder = `${company.companyName.replace(/\s+/g, "_")}_${companyRef}`;
    const employeeFolder = `${name.replace(/\s+/g, "_")}_${newEmp._id}`;
    const finalDir = path.join(__dirname, `../uploads/${companyFolder}/employees/${employeeFolder}`);
    await fs.ensureDir(finalDir);

    // 🔹 Move uploaded files from temp to correct folder
    const updatedDocs = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const targetPath = path.join(finalDir, file.filename);
        await fs.move(file.path, targetPath, { overwrite: true });
        updatedDocs.push({
          name: file.originalname,
          fileUrl: targetPath.replace(/\\/g, "/"),
        });
      }
    }

    newEmp.documents = updatedDocs;
    await empDoc.save();

    res.status(201).json({
      success: true,
      message: "✅ Employee added successfully",
      employee: newEmp,
    });
  } catch (err) {
    console.error("❌ POST /employee/add error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ LIST EMPLOYEES
------------------------------------------------------ */
router.get("/list/:companyRef", companyAuth, async (req, res) => {
  try {
    const empDoc = await CompanyEmployee.findOne({ companyRef: req.params.companyRef }).lean();
    if (!empDoc) return res.json({ success: true, employees: [] });
    res.json({ success: true, employees: empDoc.employees });
  } catch (err) {
    console.error("GET /employee/list error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ GET SINGLE EMPLOYEE (for Edit)
------------------------------------------------------ */
router.get("/:companyRef/:employeeId", companyAuth, async (req, res) => {
  try {
    const { companyRef, employeeId } = req.params;
    const empDoc = await CompanyEmployee.findOne({ companyRef }).lean();
    if (!empDoc) return res.status(404).json({ success: false, message: "Company not found" });

    const emp = empDoc.employees.find((e) => e._id.toString() === employeeId);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    res.json({ success: true, employee: emp });
  } catch (err) {
    console.error("❌ GET /employee/:id error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------------
   ✅ UPDATE EMPLOYEE (Add/Replace Docs)
------------------------------------------------------ */
router.put("/:companyRef/:employeeId", companyAuth, upload.array("documents"), async (req, res) => {
  try {
    const { companyRef, employeeId } = req.params;
    const { name, email, position, project, status, joiningDate } = req.body;

    const empDoc = await CompanyEmployee.findOne({ companyRef });
    if (!empDoc) return res.status(404).json({ success: false, message: "Company not found" });
    const emp = empDoc.employees.id(employeeId);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    Object.assign(emp, { name, email, position, project, status, joiningDate });

    // Folder setup
    const company = await CompanyDetail.findById(companyRef).lean();
    const companyFolder = `${company.companyName.replace(/\s+/g, "_")}_${companyRef}`;
    const employeeFolder = `${emp.name.replace(/\s+/g, "_")}_${employeeId}`;
    const uploadDir = path.join(__dirname, `../uploads/${companyFolder}/employees/${employeeFolder}`);
    await fs.ensureDir(uploadDir);

    // Handle new docs
    if (req.files && req.files.length > 0) {
      const newDocs = [];
      for (const file of req.files) {
        const targetPath = path.join(uploadDir, file.filename);
        await fs.move(file.path, targetPath, { overwrite: true });
        newDocs.push({ name: file.originalname, fileUrl: targetPath.replace(/\\/g, "/") });
      }
      emp.documents.push(...newDocs);
    }

    await empDoc.save();
    res.json({ success: true, message: "✅ Employee updated successfully", employee: emp });
  } catch (err) {
    console.error("❌ PUT /employee error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


/* ------------------------------------------------------
   ✅ DELETE SINGLE DOCUMENT (from one employee)
------------------------------------------------------ */
router.delete("/:companyRef/:employeeId/document/:docId", companyAuth, async (req, res) => {
  try {
    const { companyRef, employeeId, docId } = req.params;
    const empDoc = await CompanyEmployee.findOne({ companyRef });
    if (!empDoc) return res.status(404).json({ success: false, message: "Company not found" });

    const emp = empDoc.employees.id(employeeId);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    // Find the document to delete
    const doc = emp.documents.id(docId);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

    // Delete physical file
    if (doc.fileUrl && (await fs.pathExists(doc.fileUrl))) {
      await fs.remove(doc.fileUrl);
    }

    // Remove from array
    emp.documents.pull({ _id: docId });
    await empDoc.save();

    res.json({ success: true, message: "✅ Document deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE document error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


/* ------------------------------------------------------
   ✅ DELETE EMPLOYEE + CLEANUP old folders
------------------------------------------------------ */
router.delete("/:companyRef/:employeeId", companyAuth, async (req, res) => {
  try {
    const { companyRef, employeeId } = req.params;
    const empDoc = await CompanyEmployee.findOne({ companyRef });
    if (!empDoc) return res.status(404).json({ success: false, message: "Company not found" });
    const emp = empDoc.employees.id(employeeId);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    const company = await CompanyDetail.findById(companyRef).lean();
    const companyFolder = `${company.companyName.replace(/\s+/g, "_")}_${companyRef}`;
    const employeeFolder = `${emp.name.replace(/\s+/g, "_")}_${employeeId}`;
    const uploadDir = path.join(__dirname, `../uploads/${companyFolder}/employees/${employeeFolder}`);
    const oldNewFolder = path.join(__dirname, `../uploads/${companyFolder}/employees/${emp.name.replace(/\s+/g, "_")}_new`);

    if (await fs.pathExists(uploadDir)) await fs.remove(uploadDir);
    if (await fs.pathExists(oldNewFolder)) await fs.remove(oldNewFolder);

    emp.deleteOne();
    await empDoc.save();

    res.json({ success: true, message: "✅ Employee & all documents deleted" });
  } catch (err) {
    console.error("❌ DELETE /employee error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
