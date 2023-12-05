#!/usr/bin/env node
// (C) 2022-2023 GoodData Corporation

import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env.secrets") });

const workspace = process.env.WORKSPACE;
const hostname = process.env.BACKEND_URL;
const backend = process.env.BACKEND_TYPE || "tiger";

const output = "./src/md/full.ts";

process.argv.push(
    "--backend",
    backend,
    "--hostname",
    hostname,
    "--workspace-id",
    workspace,
    "--catalog-output",
    output,
);

await import("@gooddata/catalog-export");
