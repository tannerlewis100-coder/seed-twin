import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

const refund = () => read("src/routes/refund-policy.tsx");
const terms = () => read("src/routes/terms.tsx");
const shipping = () => read("src/routes/shipping-policy.tsx");
const pdp = () => read("src/routes/shop.$slug.tsx");

describe("refund policy is all-sales-final", () => {
  it("states all sales are final and excludes change of mind", () => {
    const src = refund();
    expect(src).toMatch(/All sales are final/i);
    expect(src).toMatch(/change of mind/i);
  });

  it("no longer offers a 14-day unopened return window", () => {
    const src = refund();
    expect(src).not.toMatch(/within 14 days of delivery/i);
    expect(src).not.toMatch(/may be returned/i);
  });

  it("drops the 7-day damage deadline in favour of 'promptly'", () => {
    const src = refund();
    expect(src).not.toMatch(/within 7 days/i);
    expect(src).toMatch(/promptly/i);
  });

  it("keeps a support route with the shared contact address", () => {
    const src = refund();
    expect(src).toMatch(/clarumpeps@gmail\.com/);
    expect(src).toMatch(/damaged or incorrect/i);
  });

  it("preserves rights required by applicable law and avoids absolute language", () => {
    const src = refund();
    expect(src).toMatch(/does not limit any rights or remedies required by applicable law/i);
    expect(src).not.toMatch(/under any circumstances/i);
  });

  it("is dated September 21, 2026", () => {
    expect(refund()).toMatch(/September 21, 2026/);
  });
});

describe("terms section 7 matches the refund policy", () => {
  it("is titled All Sales Final and drops the no-refunds-ever wording", () => {
    const src = terms();
    expect(src).toMatch(/All Sales Final/);
    expect(src).not.toMatch(/under any circumstances/i);
    expect(src).not.toMatch(/We do not accept returns, exchanges, or refunds/i);
  });

  it("links to the refund policy and preserves legal rights", () => {
    const src = terms();
    expect(src).toMatch(/\/refund-policy/);
    expect(src).toMatch(/required by\s+applicable law/i);
  });

  it("keeps unrelated sections intact", () => {
    const src = terms();
    expect(src).toMatch(/Governing Law and Disputes/);
    expect(src).toMatch(/Limitation of Liability/);
  });
});

describe("shipping policy section 9", () => {
  it("no longer sets a 48-hour complaint deadline", () => {
    const src = shipping();
    expect(src).not.toMatch(/48 hours/i);
    expect(src).toMatch(/promptly/i);
  });

  it("links to the refund policy for order issues", () => {
    expect(shipping()).toMatch(/\/refund-policy/);
  });

  it("keeps transit estimates and the 14-day lost-in-transit guidance", () => {
    const src = shipping();
    expect(src).toMatch(/3–5 business days/);
    expect(src).toMatch(/lost in transit for more than 14 days/i);
  });

  it("says applicable law prevails over conflicting limitations", () => {
    expect(shipping()).toMatch(/required by\s+applicable law/i);
  });
});

describe("product shipping & returns accordion", () => {
  it("states all sales are final and points to the policy for order problems", () => {
    const src = pdp();
    expect(src).toMatch(/All sales are final/i);
    expect(src).not.toMatch(/return eligibility/i);
    expect(src).toMatch(/damaged, incorrect or missing/i);
  });
});
