const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const companyAuth = require("../middleware/companyAuth");
const { CompanyDetail } = require("../models/companyDetail.model");
const { CompanyProject } = require("../models/project.model");

/* ---------------------------------------------------
   Force JSON Response
--------------------------------------------------- */
router.use((req, res, next) => {
  res.type("application/json; charset=utf-8");
  next();
});

/* ---------------------------------------------------
   TEMP STORAGE (Multer)
--------------------------------------------------- */
const tempStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/temp");
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage: tempStorage });

/* ---------------------------------------------------
   ✅ LIST ALL PROJECTS
--------------------------------------------------- */
router.get("/", companyAuth, async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    if (!companyRef)
      return res.status(400).json({ success: false, message: "Missing companyRef" });

    const projects = await CompanyProject.findOne({ companyRef }).lean();
    res.json({ success: true, projects: projects?.projects || [] });
  } catch (err) {
    console.error("❌ GET /projects:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------------------------------------
   ✅ ADD PROJECT
--------------------------------------------------- */
router.post("/add", companyAuth, upload.array("documents"), async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    if (!companyRef)
      return res.status(400).json({ success: false, message: "Missing companyRef" });

    const {
      name,
      client,
      manager,
      status,
      budget,
      startDate,
      endDate,
      description,
      technology,
      team,
    } = req.body;

    if (!name || !client)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    let projectDoc = await CompanyProject.findOne({ companyRef });
    if (!projectDoc) projectDoc = await CompanyProject.create({ companyRef });

    const newProject = {
      name,
      client,
      manager,
      status: status || "Planning",
      budget,
      startDate,
      endDate,
      description,
      technology,
      team: team ? team.split(",").map((t) => t.trim()) : [],
      documents: [],
    };
    projectDoc.projects.push(newProject);
    await projectDoc.save();

    const project = projectDoc.projects[projectDoc.projects.length - 1];
    const company = await CompanyDetail.findById(companyRef).lean();
    const companyFolder = `${company.companyName.replace(/\s+/g, "_")}_${companyRef}`;
    const projectFolder = `${project.name.replace(/\s+/g, "_")}_${project._id}`;
    const finalDir = path.join(__dirname, `../uploads/${companyFolder}/projects/${projectFolder}`);
    await fs.ensureDir(finalDir);

    const docs = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const target = path.join(finalDir, file.filename);
        await fs.move(file.path, target, { overwrite: true });
        docs.push({
          name: file.originalname,
          fileUrl: target.replace(/.*uploads[\\/]/, "/uploads/").replace(/\\/g, "/"),
          uploadedAt: new Date(),
        });
      }
    }

    project.documents = docs;
    await projectDoc.save();

    res.status(201).json({
      success: true,
      message: "✅ Project added successfully",
      project,
    });
  } catch (err) {
    console.error("❌ POST /projects/add:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------------------------------------
   ✅ UPDATE PROJECT (Auto-Rename Folder + Fix URLs + Add Docs)
--------------------------------------------------- */
router.put("/:projectId", companyAuth, upload.array("documents"), async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    const { projectId } = req.params;
    if (!companyRef)
      return res.status(400).json({ success: false, message: "Missing companyRef" });

    const projectDoc = await CompanyProject.findOne({ companyRef });
    if (!projectDoc)
      return res.status(404).json({ success: false, message: "Company not found" });

    const project = projectDoc.projects.id(projectId);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    const {
      name,
      client,
      manager,
      status,
      budget,
      startDate,
      endDate,
      description,
      technology,
      team,
    } = req.body;

    const company = await CompanyDetail.findById(companyRef).lean();
    const companyFolder = `${company.companyName.replace(/\s+/g, "_")}_${companyRef}`;
    const basePath = path.join(__dirname, `../uploads/${companyFolder}/projects`);

    const oldFolderName = `${project.name.replace(/\s+/g, "_")}_${projectId}`;
    const newFolderName = `${name.replace(/\s+/g, "_")}_${projectId}`;
    const oldFolderPath = path.join(basePath, oldFolderName);
    const newFolderPath = path.join(basePath, newFolderName);

    // ✅ Rename project folder if project name changed
    if (project.name !== name && (await fs.pathExists(oldFolderPath))) {
      await fs.move(oldFolderPath, newFolderPath, { overwrite: true });
      console.log(`📁 Folder renamed: ${oldFolderName} → ${newFolderName}`);

      // ✅ Update all stored document URLs after rename
      project.documents = project.documents.map((d) => ({
        ...d,
        fileUrl: d.fileUrl.replace(oldFolderName, newFolderName),
      }));
    } else {
      await fs.ensureDir(newFolderPath);
    }

    // ✅ Update fields
    Object.assign(project, {
      name,
      client,
      manager,
      status,
      budget,
      startDate,
      endDate,
      description,
      technology,
      team: team ? team.split(",").map((t) => t.trim()) : project.team,
    });

    // ✅ Upload and attach new documents
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const dest = path.join(newFolderPath, file.filename);
        await fs.move(file.path, dest, { overwrite: true });
        project.documents.push({
          name: file.originalname,
          fileUrl: dest.replace(/.*uploads[\\/]/, "/uploads/").replace(/\\/g, "/"),
          uploadedAt: new Date(),
        });
      }
    }

    await projectDoc.save();

    res.json({
      success: true,
      message: "✅ Project updated successfully (folder + file URLs fixed)",
      project,
    });
  } catch (err) {
    console.error("❌ PUT /projects/:projectId:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------------------------------------
   ✅ DELETE SINGLE DOCUMENT FROM PROJECT
--------------------------------------------------- */
router.delete("/:projectId/document/:docId", companyAuth, async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    const { projectId, docId } = req.params;
    console.log("🟢 DELETE CALLED:", { projectId, docId, companyRef });

    const projectDoc = await CompanyProject.findOne({ companyRef });
    if (!projectDoc) return res.status(404).json({ success: false, message: "Company not found" });

    const project = projectDoc.projects.id(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const doc = project.documents.id(docId);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

    if (doc.fileUrl) {
      const uploadsDir = path.resolve(__dirname, "../uploads");
      const relativePath = doc.fileUrl.replace(/^\/?uploads[\\/]/, "");
      const absolutePath = path.join(uploadsDir, relativePath);

      console.log("🧭 fileUrl:", doc.fileUrl);
      console.log("📂 absolutePath:", absolutePath);

      if (await fs.pathExists(absolutePath)) {
        await fs.remove(absolutePath);
        console.log("🗑️ File deleted successfully:", absolutePath);
      } else {
        console.log("⚠️ File not found at:", absolutePath);
      }
    }

    // Remove document record
    project.documents.pull({ _id: docId });
    await projectDoc.save();

    res.json({ success: true, message: "✅ Document deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE /projects/:projectId/document/:docId:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});



/* ---------------------------------------------------
   ✅ DELETE PROJECT + Folder Cleanup
--------------------------------------------------- */
router.delete("/:projectId", companyAuth, async (req, res) => {
  try {
    const companyRef = req.companyUser?.companyRef;
    const { projectId } = req.params;

    const projectDoc = await CompanyProject.findOne({ companyRef });
    if (!projectDoc)
      return res.status(404).json({ success: false, message: "Company not found" });

    const project = projectDoc.projects.id(projectId);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    const company = await CompanyDetail.findById(companyRef).lean();
    const companyFolder = `${company.companyName.replace(/\s+/g, "_")}_${companyRef}`;
    const folder = path.join(
      __dirname,
      `../uploads/${companyFolder}/projects/${project.name.replace(/\s+/g, "_")}_${projectId}`
    );

    // ✅ Remove entire project folder
    if (await fs.pathExists(folder)) {
      await fs.remove(folder);
      console.log("🗑️ Folder deleted:", folder);
    }

    project.deleteOne();
    await projectDoc.save();

    res.json({ success: true, message: "✅ Project & folder deleted" });
  } catch (err) {
    console.error("❌ DELETE /projects:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
