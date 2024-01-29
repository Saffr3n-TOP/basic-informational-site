import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import * as fs from "fs/promises";

const port = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const validPageNames = ["index.html", "about.html", "contact-me.html"];

createServer(async (req, res) => {
  const url = new URL(req.url, "http://" + req.headers.host);
  const pageName = url.pathname.slice(1);
  const page = await getPage(pageName);
  const statusCode = !page ? 500 : isValidPageName(pageName) ? 200 : 404;

  res.writeHead(statusCode, { "Content-Type": "text/html" });

  if (statusCode === 500) {
    return res.end("Server Error");
  }

  res.end(page);
}).listen(port, () => {
  console.log("Server is running on port", port);
});

async function getPage(name) {
  const page = await fs
    .readFile(
      path.resolve(
        __dirname,
        "pages",
        isValidPageName(name) ? name || "index.html" : "404.html"
      )
    )
    .catch((err) => console.error(err));

  return page || null;
}

function isValidPageName(name) {
  return !name || validPageNames.includes(name);
}
