import { request } from "https";
import { URL } from "url";

function fetch<T>(url: URL): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = request(
      url,
      { headers: { Accept: "application/json; charset=utf-8" } },
      (res) => {
        res.setEncoding("utf8");

        let json = "";

        res.on("data", (chunk) => {
          json += chunk;
        });

        res.on("end", () => {
          const data = JSON.parse(json);
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
