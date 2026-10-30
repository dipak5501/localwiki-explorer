import test from "node:test";
import assert from "node:assert/strict";
import { uid } from "../src/logic.js";
test("uid", () => assert.match(uid(), /^p-/));
