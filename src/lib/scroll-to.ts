// Smoothly scrolls the section with the given id into view, aligned to the top of the viewport.
// Shared by the hero CTA buttons (Hero.astro) and the desktop nav (Navbar.astro).
export function scrollToSection(id: string): void {
	document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
