// Suggest a corrected email when the domain looks like a typo of a common provider.

const DOMAIN_TYPOS: Record<string, string> = {
  // gmail
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmall.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.cmo": "gmail.com",
  "gmailc.om": "gmail.com",
  "gmail.om": "gmail.com",
  // yahoo
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhaoo.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  "yahoo.cmo": "yahoo.com",
  // hotmail
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotnail.com": "hotmail.com",
  "hotmall.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "hotmail.cmo": "hotmail.com",
  // outlook
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outloook.com": "outlook.com",
  "outlook.con": "outlook.com",
  "outlook.co": "outlook.com",
  "outlook.cm": "outlook.com",
  "outlook.cmo": "outlook.com",
  // icloud
  "iclould.com": "icloud.com",
  "icloud.con": "icloud.com",
  "icloud.co": "icloud.com",
  "icloud.cm": "icloud.com",
  "icloud.cmo": "icloud.com",
  // aol
  "aol.con": "aol.com",
  "aol.co": "aol.com",
  "aol.cm": "aol.com",
  "aol.cmo": "aol.com",
  "aoll.com": "aol.com",
  // hmail — common gmail miskey
  "hmail.com": "gmail.com",
};

// Bases whose TLD we'll correct if the local domain ends in .con/.cmo/.co/.cm/.om
const KNOWN_BASES = ["gmail", "yahoo", "hotmail", "outlook", "icloud", "aol"];
const BAD_TLDS = [".con", ".cmo", ".co", ".cm", ".om"];

export function suggestEmailCorrection(input: string): string | null {
  const email = input.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  const local = input.trim().slice(0, at); // preserve original case of local part
  const domain = email.slice(at + 1);
  if (!domain.includes(".")) return null;

  const direct = DOMAIN_TYPOS[domain];
  if (direct && direct !== domain) return `${local}@${direct}`;

  // Generic .con/.co/.cmo → .com fix for any domain
  for (const bad of BAD_TLDS) {
    if (domain.endsWith(bad)) {
      const base = domain.slice(0, -bad.length);
      if (base.length > 0) {
        const fixed = `${base}.com`;
        if (fixed !== domain) return `${local}@${fixed}`;
      }
    }
  }

  // Base matches a known provider but TLD is off (e.g. gmail.something)
  const dot = domain.indexOf(".");
  const base = domain.slice(0, dot);
  if (KNOWN_BASES.includes(base) && domain !== `${base}.com`) {
    return `${local}@${base}.com`;
  }

  return null;
}
