import { request } from "https";
import { URL } from "url";

interface FetchOptions {
  json?: boolean;
}

function fetch<T>(url: URL, options?: FetchOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = request(
      url,
      { headers: { Accept: "application/json; charset=utf-8" } },
      (res) => {
        res.setEncoding("utf8");

        let responseText = "";

        res.on("data", (chunk) => {
          responseText += chunk;
        });

        res.on("end", () => {
          const data = options?.json ? JSON.parse(responseText) : responseText;
          console.log(`<-- GET ${res.statusCode} ${url.toString()}`);
          resolve(data);
        });
      }
    );

    req.on("error", (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });

    console.log(`--> GET ${url.toString()}`);

    req.end();
  });
}

export default fetch;
