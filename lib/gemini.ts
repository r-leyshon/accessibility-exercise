import { VertexAI, type GenerativeModel } from "@google-cloud/vertexai";

let _model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel {
  if (!_model) {
    const project = process.env.GCP_PROJECT_ID || "";
    const location = process.env.GCP_LOCATION || "europe-west2";

    const options: ConstructorParameters<typeof VertexAI>[0] = {
      project,
      location,
    };

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      options.googleAuthOptions = { credentials };
    }

    const vertexAI = new VertexAI(options);
    _model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }
  return _model;
}
