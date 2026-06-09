const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "del", "ins", "sub", "sup",
  "ul", "ol", "li",
  "a", "img",
  "blockquote", "pre", "code", "code",
  "span", "div",
  "table", "thead", "tbody", "tr", "th", "td",
  "abbr", "cite",
]);

const ATTRIBUTE_ALLOWLIST: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan"]),
  span: new Set(["style"]),
  p: new Set(["style"]),
  div: new Set(["style"]),
  "*": new Set(["class", "id", "dir"]),
};

const STYLE_PATTERN = /^[a-z-]+:\s*[^;{}]+(;\s*[a-z-]+:\s*[^;{}]+)*$/i;

const PROTOCOL_ALLOWLIST = new Set(["http:", "https:", "mailto:", "tel:"]);

const STYLES_ALLOWLIST = new Set([
  "color", "background-color", "background",
  "font-size", "font-weight", "font-style", "font-family",
  "text-align", "text-decoration", "text-transform",
  "line-height", "letter-spacing",
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "border", "border-radius",
  "width", "height", "max-width", "max-height",
]);

function isSafeProtocol(attr: string, value: string): boolean {
  if (attr !== "href" && attr !== "src") return true;
  const protocol = value.split("://")[0];
  if (!protocol || protocol === value) return true;
  return PROTOCOL_ALLOWLIST.has(protocol + ":");
}

function isSafeStyle(value: string): boolean {
  if (!STYLE_PATTERN.test(value)) return false;
  const declarations = value.split(";").map((d) => d.trim()).filter(Boolean);
  return declarations.every((decl) => {
    const prop = decl.split(":")[0]?.trim().toLowerCase();
    return prop && STYLES_ALLOWLIST.has(prop);
  });
}

export function sanitizeHtml(input: string): string {
  if (!input) return "";

  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*on\w+\s*=\s*["'][^"']*["'][^>]*>/gi, (match) => {
      return match.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
    })
    .replace(/<(\/?)(\w+)[^>]*>/g, (fullTag, slash, tagName) => {
      const lowerTag = tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(lowerTag)) return "";

      if (slash) return `</${lowerTag}>`;

      const attrs: string[] = [];
      const attrRegex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
      let attrMatch: RegExpExecArray | null;

      const tagAttrs = ATTRIBUTE_ALLOWLIST[lowerTag] ?? new Set();
      const globalAttrs = ATTRIBUTE_ALLOWLIST["*"]!;

      while ((attrMatch = attrRegex.exec(fullTag)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

        if (!tagAttrs.has(attrName) && !globalAttrs.has(attrName)) continue;

        if (attrName === "style" && !isSafeStyle(attrValue)) continue;
        if (attrName === "class" && /[<>\s"'\\]/.test(attrValue)) continue;
        if (!isSafeProtocol(attrName, attrValue)) continue;

        attrs.push(`${attrName}="${attrValue.replace(/"/g, "&quot;")}"`);
      }

      if (attrs.length === 0) return `<${lowerTag}>`;
      return `<${lowerTag} ${attrs.join(" ")}>`;
    });
}
