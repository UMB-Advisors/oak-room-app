#!/usr/bin/env node
// Builds a signed .pkpass for the Oak Room Members Pass.
//
// Prerequisites — see docs/pitch/PITCH-PACKET.md Part 6:
//   - scripts/pass-cert/passkey.pem   (your private key)
//   - scripts/pass-cert/passcert.pem  (Apple-issued Pass Type cert, PEM)
//   - scripts/pass-cert/wwdr.pem      (Apple WWDR intermediate cert, PEM)
//   - scripts/pass-template.pass/pass.json with real teamIdentifier
//   - scripts/pass-template.pass/icon.png + icon@2x.png + icon@3x.png
//
// Usage:
//   node scripts/build-pass.mjs                 # builds Tilman's pass
//   node scripts/build-pass.mjs --member 0184   # builds member 0184 (uses stub data)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { PKPass } from "passkit-generator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const CERT_DIR = path.join(ROOT, "scripts/pass-cert");
const TEMPLATE_DIR = path.join(ROOT, "scripts/pass-template.pass");
const OUT_DIR = path.join(ROOT, "public/passes");

const required = [
  path.join(CERT_DIR, "passkey.pem"),
  path.join(CERT_DIR, "passcert.pem"),
  path.join(CERT_DIR, "wwdr.pem"),
  path.join(TEMPLATE_DIR, "pass.json"),
  path.join(TEMPLATE_DIR, "icon.png"),
  path.join(TEMPLATE_DIR, "icon@2x.png"),
  path.join(TEMPLATE_DIR, "icon@3x.png"),
];

const missing = required.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error("\n✘ Cannot build pass — missing files:\n");
  missing.forEach((p) => console.error("    " + path.relative(ROOT, p)));
  console.error("\nSee docs/pitch/PITCH-PACKET.md Part 6 for setup.\n");
  process.exit(1);
}

// Stub member roster — pitch-demo data only. Replace with a DB lookup
// in the real build (see Part 5 of the pitch packet for the schema).
const ROSTER = {
  default: { name: "Taylor Fertitta", memberNo: "№ 0024", tier: "Founders", code: "OR-0024-FNDR" },
  "0184": { name: "Dustin Powers",    memberNo: "№ 0184", tier: "Founders", code: "OR-0184-FNDR" },
  "0001": { name: "Tilman Fertitta",  memberNo: "№ 0001", tier: "Founders", code: "OR-0001-FNDR" },
};

const memberId = process.argv.includes("--member")
  ? process.argv[process.argv.indexOf("--member") + 1]
  : "default";
const member = ROSTER[memberId] ?? ROSTER.default;

const pass = await PKPass.from(
  {
    model: TEMPLATE_DIR,
    certificates: {
      wwdr: fs.readFileSync(path.join(CERT_DIR, "wwdr.pem")),
      signerCert: fs.readFileSync(path.join(CERT_DIR, "passcert.pem")),
      signerKey: fs.readFileSync(path.join(CERT_DIR, "passkey.pem")),
      // signerKeyPassphrase: process.env.PASS_KEY_PASSPHRASE  // uncomment if your key is encrypted
    },
  },
  {
    serialNumber: crypto.randomUUID(),
  }
);

// Override fields from the roster — the template has placeholder values.
pass.setBarcodes({
  format: "PKBarcodeFormatQR",
  message: member.code,
  messageEncoding: "iso-8859-1",
  altText: member.code,
});

// passkit-generator exposes field arrays for in-place mutation
const setField = (fieldArray, key, value) => {
  const f = fieldArray.find((x) => x.key === key);
  if (f) f.value = value;
};
setField(pass.props.storeCard.secondaryFields, "name", member.name);
setField(pass.props.storeCard.auxiliaryFields, "tier", member.tier);
setField(pass.props.storeCard.auxiliaryFields, "memberNo", member.memberNo);

fs.mkdirSync(OUT_DIR, { recursive: true });
const outFile = path.join(OUT_DIR, `${memberId === "default" ? "founders" : memberId}.pkpass`);
fs.writeFileSync(outFile, pass.getAsBuffer());

console.log(`✓ Wrote ${path.relative(ROOT, outFile)}`);
console.log(`  Member: ${member.name} (${member.code})`);
console.log(`  Serial: ${pass.props.serialNumber}`);
