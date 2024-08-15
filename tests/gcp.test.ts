import * as gcp from "../src/gcp";
import io = require("@actions/io");
import fs = require("fs");
import path = require("path");

const workspaceDir = path.join(__dirname, "runner", "workspace");
process.env.GITHUB_WORKSPACE = workspaceDir;

describe("GCP Service Account setup", () => {
  let stdoutSpy: jest.SpyInstance;
  beforeAll(async () => {
    await io.mkdirP(workspaceDir);
    stdoutSpy = jest.spyOn(global.process.stdout, "write").mockImplementation();
  });

  afterAll(async () => {
    await io.rmRF(workspaceDir);
    stdoutSpy.mockRestore();
  });

  const serviceAccountKey = `{
    "type": "service_account",
    "project_id": "cf-2tier-uhd-test-e9",
    "private_key_id": "d8408c56b4a57407ea778a888dc57a23c41d148a",
    "private_key": "private-key",
    "client_email": "waas-read-gcp-secrets@cf-2tier-uhd-test-d7.iam.gserviceaccount.com",
    "client_id": "107168999965407057625",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/waas-read-gcp-secrets%40cf-2tier-uhd-test-e9.iam.gserviceaccount.com"
  }`;

  it("should process an JSON string", async () => {
    await gcp.setupServiceAccount(serviceAccountKey);
    expect(process.env.GCLOUD_PROJECT).toEqual("cf-2tier-uhd-test-e9");
    expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).toMatch(/workspace/);
    expect(fs.existsSync(path.resolve(String(process.env.GOOGLE_APPLICATION_CREDENTIALS)))).toBe(true);
  });

  it("should process an base64 encoded string", async () => {
    const input = Buffer.from(serviceAccountKey, "ascii").toString("base64");
    await gcp.setupServiceAccount(input);
    expect(process.env.GCLOUD_PROJECT).toEqual("cf-2tier-uhd-test-e9");
    expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).toMatch(/workspace/);
    expect(fs.existsSync(path.resolve(String(process.env.GOOGLE_APPLICATION_CREDENTIALS)))).toBe(true);
  });
});
