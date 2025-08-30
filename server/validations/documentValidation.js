const { z } = require("zod");

const documentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional()
});

module.exports = { documentSchema };
