// @hugeicons/core-free-icons ships each icon as a nested array of [tag, attrs, children?] nodes.
// This serialises that structure to an SVG inner-markup string, shared by Icon.astro (set:html)
// and the React Icon used in client islands (dangerouslySetInnerHTML) so the logic lives once.

export type IconNode = readonly [string, Record<string, string | number>?, IconNode[]?];

function renderNode([tag, attrs = {}, children = []]: IconNode): string {
	const attrString = Object.entries(attrs)
		.map(([k, v]) => `${k}="${v}"`)
		.join(" ");
	const inner = children.map(renderNode).join("");
	return `<${tag} ${attrString}>${inner}</${tag}>`;
}

export function iconToSvg(icon: readonly IconNode[]): string {
	return icon.map(renderNode).join("");
}
