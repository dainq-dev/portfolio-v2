import { serve } from "bun";
import index from "./index.html";
import { join } from "path";

const serveStatic = async (req: Request) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/index.css") {
    const file = Bun.file(join(process.cwd(), "src", "index.css"));
    return new Response(file, { headers: { "Content-Type": "text/css" } });
  }

  const publicPath = join(process.cwd(), "public", url.pathname);
  const file = Bun.file(publicPath);
  if (await file.exists()) {
    // Determine content type manually for HDR if needed, though Bun usually sets it
    const headers = new Headers();
    if (url.pathname.endsWith('.hdr')) headers.set('Content-Type', 'application/octet-stream');
    return new Response(file, { headers });
  }
  return new Response(index);
};

const server = serve({
  port: 3002,
  routes: {
    "/index.css": serveStatic,
    "/models/*": serveStatic,
    "/images/*": serveStatic,
    "/draco/*": serveStatic,
    
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({ message: "Hello, world!", method: "GET" });
      },
      async PUT(req) {
        return Response.json({ message: "Hello, world!", method: "PUT" });
      },
    },
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
