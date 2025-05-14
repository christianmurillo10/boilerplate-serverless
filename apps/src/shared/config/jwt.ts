export default {
  secret: process.env.JWT_SECRET || "fGeyJpZCI6NCwiaWF0IjoxNDk0ODY3NDQ0LCJleHAiOjE0OTQ4NzgyNDR9",
  audience: process.env.JWT_AUDIENCE || "Boilerplate"
};