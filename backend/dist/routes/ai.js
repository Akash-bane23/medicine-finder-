"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../data/db");
const router = (0, express_1.Router)();
const DISCLAIMER_TEXT = "This information is for educational purposes only and is not a substitute for advice from a qualified doctor or pharmacist.";
// POST /api/v1/ai/ask
router.post('/ask', (req, res) => {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid question for the AI Assistant.'
        });
    }
    const cleanQuery = question.trim().toLowerCase();
    // Search medicines in database
    const allMedicines = db_1.db.getMedicines();
    const matchedMedicines = allMedicines.filter(m => cleanQuery.includes(m.name.toLowerCase()) ||
        cleanQuery.includes(m.genericName.toLowerCase()) ||
        cleanQuery.includes(m.brandName.toLowerCase()) ||
        cleanQuery.includes(m.category.toLowerCase()) ||
        m.name.toLowerCase().split(' ').some(word => word.length > 3 && cleanQuery.includes(word)) ||
        m.uses.toLowerCase().split(' ').some(word => word.length > 4 && cleanQuery.includes(word)));
    let reply = "";
    let related = [];
    if (matchedMedicines.length > 0) {
        const med = matchedMedicines[0];
        related = matchedMedicines.slice(0, 3);
        if (cleanQuery.includes('what is') || cleanQuery.includes('tell me about') || cleanQuery.includes('use') || cleanQuery.includes('purpose')) {
            reply = `**${med.name}** (${med.brandName}) contains the active formulation **${med.genericName}**.\n\n` +
                `• **Category**: ${med.category} (${med.dosageForm})\n` +
                `• **Common Uses**: ${med.uses}\n` +
                `• **Prescription Required**: ${med.prescriptionRequired ? 'Yes (Rx Required)' : 'No (OTC Available)'}\n` +
                `• **Storage**: ${med.storage}\n` +
                `• **Precautions**: ${med.precautions}\n` +
                `• **Known Side Effects**: ${med.sideEffects}`;
        }
        else if (cleanQuery.includes('side effect') || cleanQuery.includes('precaution') || cleanQuery.includes('safe')) {
            reply = `Here is safety & precaution information for **${med.name}**:\n\n` +
                `• **Precautions**: ${med.precautions}\n` +
                `• **Side Effects**: ${med.sideEffects}\n` +
                `• **Storage Instructions**: ${med.storage}\n` +
                `• **Prescription Status**: ${med.prescriptionRequired ? 'Requires valid doctor prescription' : 'Over-the-counter medication'}`;
        }
        else if (cleanQuery.includes('prescription') || cleanQuery.includes('rx')) {
            reply = `**${med.name}** ${med.prescriptionRequired ? 'requires a valid doctor prescription before dispensing.' : 'is an over-the-counter (OTC) medication.'}`;
        }
        else {
            reply = `**${med.name}** (${med.genericName}) is a ${med.dosageForm} categorized under **${med.category}**.\n` +
                `Primary uses include: ${med.uses}. Storage instructions: ${med.storage}.`;
        }
    }
    else {
        // Fallback general guidance for questions without a direct database medicine match
        reply = `I searched our MediPlus database for your query "${question}". While I couldn't find a direct single medicine match in our verified database index, here are general health guidance guidelines:\n\n` +
            `• You can search for medicines by generic formulation (e.g., *Paracetamol*, *Cetirizine*, *Pantoprazole*).\n` +
            `• Always check whether prescription verification is required for medications.\n` +
            `• Consult a licensed doctor or registered pharmacist for specialized dosage recommendations.`;
    }
    return res.json({
        success: true,
        answer: reply,
        disclaimer: DISCLAIMER_TEXT,
        relatedMedicines: related
    });
});
exports.default = router;
