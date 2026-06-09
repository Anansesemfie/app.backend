"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtml = sanitizeHtml;
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
const ATTRIBUTE_ALLOWLIST = {
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
function isSafeProtocol(attr, value) {
    if (attr !== "href" && attr !== "src")
        return true;
    const protocol = value.split("://")[0];
    if (!protocol || protocol === value)
        return true;
    return PROTOCOL_ALLOWLIST.has(protocol + ":");
}
function isSafeStyle(value) {
    if (!STYLE_PATTERN.test(value))
        return false;
    const declarations = value.split(";").map((d) => d.trim()).filter(Boolean);
    return declarations.every((decl) => {
        var _a;
        const prop = (_a = decl.split(":")[0]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        return prop && STYLES_ALLOWLIST.has(prop);
    });
}
function sanitizeHtml(input) {
    if (!input)
        return "";
    return input
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*on\w+\s*=\s*["'][^"']*["'][^>]*>/gi, (match) => {
        return match.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
    })
        .replace(/<(\/?)(\w+)[^>]*>/g, (fullTag, slash, tagName) => {
        var _a, _b, _c, _d;
        const lowerTag = tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(lowerTag))
            return "";
        if (slash)
            return `</${lowerTag}>`;
        const attrs = [];
        const attrRegex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
        let attrMatch;
        const tagAttrs = (_a = ATTRIBUTE_ALLOWLIST[lowerTag]) !== null && _a !== void 0 ? _a : new Set();
        const globalAttrs = ATTRIBUTE_ALLOWLIST["*"];
        while ((attrMatch = attrRegex.exec(fullTag)) !== null) {
            const attrName = attrMatch[1].toLowerCase();
            const attrValue = (_d = (_c = (_b = attrMatch[2]) !== null && _b !== void 0 ? _b : attrMatch[3]) !== null && _c !== void 0 ? _c : attrMatch[4]) !== null && _d !== void 0 ? _d : "";
            if (!tagAttrs.has(attrName) && !globalAttrs.has(attrName))
                continue;
            if (attrName === "style" && !isSafeStyle(attrValue))
                continue;
            if (attrName === "class" && /[<>\s"'\\]/.test(attrValue))
                continue;
            if (!isSafeProtocol(attrName, attrValue))
                continue;
            attrs.push(`${attrName}="${attrValue.replace(/"/g, "&quot;")}"`);
        }
        if (attrs.length === 0)
            return `<${lowerTag}>`;
        return `<${lowerTag} ${attrs.join(" ")}>`;
    });
}
