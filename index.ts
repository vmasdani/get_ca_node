import { exec } from "child_process";
import express from "express";
import util from "util";

const app = express();

app.use("/", async (req, res) => {
  const url = req.query.url as string | null | undefined;
  const port = req.query.port as string | null | undefined;

  if (
    !url ||
    !url?.match(
      /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/g
    )
  ) {
    res.status(500);
    res.send(`Invalid domain name: ${url}`);
  } else if (!port || isNaN(parseInt(port ?? ""))) {
    res.status(500);
    res.send(`Invalid port: ${port}`);
  } else {
    try {
      const result = await util.promisify(exec)(
        `/usr/bin/openssl s_client -showcerts -servername ${url} -connect ${url}:${port} </dev/null`
      );

      // console.log(result.stdout);

      res.setHeader("content-type", "text/plain");
      res.send(
        `-----BEGIN CERTIFICATE-----\n${result.stdout
          .split("-----BEGIN CERTIFICATE-----")?.[2]
          ?.split("-----END CERTIFICATE-----")?.[0]
          ?.trim()}\n-----END CERTIFICATE-----`
      );
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  }
});

export default app;
