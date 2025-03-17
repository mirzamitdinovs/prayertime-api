export const swaggerConfig = {
  documentation: {
    openapi: "3.0.0",
    info: {
      title: "", // ✅ Remove Title
      version: "", // ✅ Remove Version
      description: "", // ✅ Remove Description
    },
    servers: [], // ✅ Remove Servers section
    tags: undefined, // ✅ Remove Tags section
  },
  swaggerUI: {
    docExpansion: "none", // ✅ Collapse everything by default
    defaultModelsExpandDepth: -1, // ✅ Hide schemas (Model section)
    displayOperationId: false, // ✅ Remove "Copy Link"
    showExtensions: false, // ✅ Hide extra metadata
    showCommonExtensions: false, // ✅ Hide extra fields
    tryItOutEnabled: false, // ✅ Remove "Try it out" button (optional)
    filter: false, // ✅ Remove search box
    displayRequestDuration: false, // ✅ Hide request duration
  },
};
