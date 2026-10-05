import type { NavLink } from "@lib/data/links";

// Returns the id of the section currently considered "active" for scroll-spy: the last section
// whose top has crossed `line` px below the viewport top, falling back to the first link, or the
// last link when the page is scrolled to the bottom. Shared by the desktop nav (Navbar.astro) and
// the mobile sheet (MobileNav.tsx) so the threshold and logic stay in one place.
export function activeSectionId(links: readonly NavLink[], line = 140): string {
	let current = links[0].id;

	for (const link of links) {
		const element = document.getElementById(link.id);
		if (!element) continue;
		if (element.getBoundingClientRect().top - line <= 0) current = link.id;
	}

	const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
	if (atBottom) current = links[links.length - 1].id;

	return current;
}
