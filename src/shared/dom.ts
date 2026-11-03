let sharedParser: DOMParser | null = null;

/**
 * Safely parses an HTML template string into DOM nodes and replaces the element's children
 * without using direct `.innerHTML` assignment (satisfying Firefox AMO / no-unsanitized rules).
 */
export function setHtmlContent(el: Element, html: string): void {
  if (!html) {
    el.replaceChildren();
    return;
  }
  if (!sharedParser) {
    sharedParser = new DOMParser();
  }
  const doc = sharedParser.parseFromString(`<!doctype html><html><body>${html}</body></html>`, 'text/html');
  doc.body.querySelectorAll('script, iframe, object, embed').forEach((n) => n.remove());
  doc.body.querySelectorAll('*').forEach((elem) => {
    for (const attr of Array.from(elem.attributes)) {
      if (attr.name.toLowerCase().startsWith('on')) {
        elem.removeAttribute(attr.name);
      }
    }
  });
  const nodes = Array.from(doc.body.childNodes).map((n) => document.importNode(n, true));
  el.replaceChildren(...nodes);
}
