import * as XLSX from "xlsx";
import { Lead } from "../models/lead.model.js";
import { Workflow } from "../models/workflow.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const COLUMN_PATTERNS = {
    name: ["name", "full name", "fullname", "contact name", "lead name"],
    email: ["email", "email address", "e-mail", "emailaddress", "mail"],
    company: ["company", "company name", "companyname", "organization", "org"],
    title: ["title", "job title", "jobtitle", "designation", "role", "position"],
    phone: ["phone", "phone number", "phonenumber", "mobile", "mobile number", "contact number"],
    telegram_id: ["telegram_id", "telegram id", "telegramid", "telegram", "tg_id", "tgid"],
};

function detectColumns(headers) {
    const detected = {};

    for (const [field, patterns] of Object.entries(COLUMN_PATTERNS)) {
        for (const header of headers) {
            const normalized = header.toLowerCase().trim();
            if (patterns.includes(normalized)) {
                detected[field] = header;
                break;
            }
        }
    }

    return detected;
}

function parseFile(buffer, originalname) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

export const uploadLeads = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { workflowId } = req.body;

    if (!workflowId) {
        return res.status(400).json({ message: "workflowId is required" });
    }

    const workflow = await Workflow.findOne({
        _id: workflowId,
        userId: req.user._id,
    });

    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }

    const rows = parseFile(req.file.buffer, req.file.originalname);

    if (!rows.length) {
        return res.status(400).json({ message: "File is empty or has no data rows" });
    }

    const headers = Object.keys(rows[0]);
    const detectedColumns = detectColumns(headers);

    const leads = rows.map((row) => ({
        userId: req.user._id,
        workflowId: workflow._id,   // ObjectId — avoids bulkWrite casting ambiguity
        name: detectedColumns.name ? row[detectedColumns.name] : "",
        email: detectedColumns.email ? row[detectedColumns.email] : "",
        company: detectedColumns.company ? row[detectedColumns.company] : "",
        title: detectedColumns.title ? row[detectedColumns.title] : "",
        phone: detectedColumns.phone ? row[detectedColumns.phone] : "",
        telegram_id: detectedColumns.telegram_id ? String(row[detectedColumns.telegram_id]) : "",
    }));

    // Upsert by (userId + workflowId + email) so re-uploading the same file
    // never causes a duplicate-key error.
    const ops = leads.map((lead) => ({
        updateOne: {
            filter: { userId: lead.userId, workflowId: lead.workflowId, email: lead.email || null },
            update: { $set: lead },
            upsert: true,
        },
    }));

    await Lead.bulkWrite(ops, { ordered: false });

    const savedLeads = await Lead.find({
        userId: leads[0].userId,
        workflowId: leads[0].workflowId,
    });

    return res.status(201).json({
        detectedColumns,
        leads: savedLeads,
    });
});
