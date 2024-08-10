import { join } from "node:path";
import { createMilkioApp } from "milkio";
import { milkioStatic } from "milkio-static-for-node";

export const milkio = createMilkioApp({
  middlewares: () => [
    ...(typeof electron === "undefined"
      ? []
      : [
          milkioStatic({
            assets: join(electron.app.getAppPath(), "dist-static"),
            notFound: "index.html",
          }),
        ]),
    // middlewares
  ],
});
