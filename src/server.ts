import fastify from "fastify";
import { z } from "zod";
import { sql } from "./lib/postgres";
import postgres from "postgres";

const app = fastify();

app.get("/:code", async (request, reply) => {
  const { code } = z
    .object({
      code: z.string().min(3),
    })
    .parse(request.params);

  const result = await sql/**/ `SELECT id, original_url
    FROM short_links WHERE short_links.short_url = ${code}
  `;

  if (result.length === 0) {
    return reply.status(400).send({ message: "link not found" });
  }

  const link = result[0];

  return reply.redirect(301, link.original_url);
});

app.get("/api/links", async () => {
  const result = await sql/*sql*/ `
    SELECT * FROM short_links ORDER BY created_at DESC;
  `;

  return result;
});

app.post("/api/links", async (request, reply) => {
  const { shortUrl, originalUrl } = z
    .object({
      shortUrl: z.string().min(3),
      originalUrl: z.string().url(),
    })
    .parse(request.body);

  try {
    const result = await sql/*sql*/ `
        INSERT INTO short_links (short_url, original_url) 
        VALUES (${shortUrl}, ${originalUrl})
        RETURNING id
      `;

    const link = result[0];

    return reply.status(201).send({ shortLinkId: link.id });
  } catch (err) {
    if (err instanceof postgres.PostgresError) {
      if (err.code === "23505") {
        return reply.status(400).send({ message: "Short link already exists" });
      }
    }

    console.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });
