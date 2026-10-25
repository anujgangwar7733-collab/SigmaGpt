import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/Groq.js"; 
const router = express.Router();

//test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread"
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

import mongoose from "mongoose";

//Get all thread

router.get("/threads", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json([]);
        }
        const threads = await Thread.find().sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get threads" });
    }
});

//thread/:id

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const query = mongoose.isValidObjectId(threadId)
            ? { $or: [{ threadId }, { _id: threadId }] }
            : { threadId };
        const thread = await Thread.findOne(query);
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages || []);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get thread" });
    }
});


// delete thread 

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const query = mongoose.isValidObjectId(threadId)
            ? { $or: [{ threadId }, { _id: threadId }] }
            : { threadId };
        const deletedThread = await Thread.findOneAndDelete(query);

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        // 1. Get AI response from Groq
        const assistantReply = await getOpenAIAPIResponse(message);

        // 2. Save in MongoDB if connected
        try {
            let thread = await Thread.findOne({ threadId });

            if (!thread) {
                thread = new Thread({
                    threadId,
                    title: message,
                    messages: [
                        { role: "user", content: message },
                        { role: "assistant", content: assistantReply }
                    ]
                });
            } else {
                thread.messages.push({ role: "user", content: message });
                thread.messages.push({ role: "assistant", content: assistantReply });
                thread.updatedAt = new Date();
            }

            await thread.save();
        } catch (dbErr) {
            console.warn("Database save warning:", dbErr.message);
        }

        res.json({ reply: assistantReply });
    } catch (err) {
        console.error("Chat route error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
