import express from "express";
import Thread from "../models/thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "sample thread",
    });

    const response = await thread.save();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to save in db " });
  }
});

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Thread not found" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    let deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      res.status(404).json({ error: "thread not deleted" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Thread not deleted" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    res.status(400).json({ error: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
