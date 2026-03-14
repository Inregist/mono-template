import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

export const openApiRefPlugin = new OpenAPIReferencePlugin({
  docsProvider: "scalar", // default: 'scalar'
  schemaConverters: [new ZodToJsonSchemaConverter()],
  specGenerateOptions: {
    info: {
      title: "ORPC Playground",
      version: "1.0.0",
    },
    servers: [{ url: "/api/rpc" }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
});
