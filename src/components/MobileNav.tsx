import { Menu01Icon } from "@hugeicons/core-free-icons";
import { useRef, useState } from "react";
import { iconToSvg, type IconNode } from "@lib/icon";
import type { NavLink } from "@lib/data/links";
import { activeSectionId } from "@lib/scroll-spy";
import { scrollToSection } from "@lib/scroll-to";
import { cn } from "@lib/utils";
import { BottomSheet } from "./ui/BottomSheet";
import { CloseButton } from "./ui/CloseButton";

// ================================================================================================
// Icon
// ================================================================================================
// Injects the serialised SVG (see iconToSvg) rather than building React nodes, which avoids
// React's SVG attribute camelCasing (stroke-width, stroke-linecap, …) entirely.

type IconProps = {
	icon: readonly IconNode[];
	size?: number;
	strokeWidth?: number;
	className?: string;
};

function Icon({ icon, size = 24, strokeWidth = 1.5, className }: IconProps) {
	const innerSVG = iconToSvg(icon);
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
			focusable="false"
			dangerouslySetInnerHTML={{ __html: innerSVG }}
		/>
	);
}

// ================================================================================================
// MobileNav
// ================================================================================================

type Props = {
	links: readonly NavLink[];
	/** ThemeToggle is slotted in from Astro (default slot) so its hoisted script stays intact. */
	children?: React.ReactNode;
};

export default function MobileNav({ links, children }: Props) {
	const [activeId, setActiveId] = useState<string | null>(null);
	// The section to scroll to once the sheet has finished dismissing. Scrolling while the sheet is
	// open is blocked by Silk's scroll lock, so we defer it until the sheet is fully gone.
	const pendingTarget = useRef<string | null>(null);

	// The sheet is uncontrolled — Silk owns its open/close state, driven by the present/dismiss
	// Triggers. We only observe the travel status: page scroll is locked while open, so the active
	// section is fixed for the sheet's lifetime — compute it once as it enters. Then once the sheet
	// has fully exited (scroll lock released) we run any pending link scroll.
	function handleTravelStatusChange(status: string) {
		if (status === "entering") {
			setActiveId(activeSectionId(links));
			return;
		}
		if (status === "idleOutside") {
			const id = pendingTarget.current;
			if (!id) return;
			pendingTarget.current = null;
			scrollToSection(id);
		}
	}

	return (
		<BottomSheet.Root>
			<BottomSheet.Trigger asChild>
				<button
					className="text-foreground focus-visible:bg-secondary hover:bg-secondary grid size-9 place-items-center-safe rounded-full transition-colors md:hidden"
					aria-label="Open menu"
				>
					<Icon icon={Menu01Icon} size={16} />
				</button>
			</BottomSheet.Trigger>

			<BottomSheet.Portal>
				<BottomSheet.View onTravelStatusChange={handleTravelStatusChange}>
					<BottomSheet.Backdrop />
					<BottomSheet.Content className="grid justify-items-center-safe pb-[max(calc(env(safe-area-inset-bottom,0px)+12px),1.5rem)] max-inline-125">
						<div className="px-5 pbs-8 pbe-6 inline-full">
							<BottomSheet.Title asChild>
								<div className="flex items-center-safe justify-between">
									<h2 className="text-lg font-semibold">Menu</h2>
									<BottomSheet.Trigger action="dismiss" asChild>
										<CloseButton aria-label="Close menu" />
									</BottomSheet.Trigger>
								</div>
							</BottomSheet.Title>
							<BottomSheet.Description asChild>
								<p className="sr-only">Navigate to a section of the portfolio</p>
							</BottomSheet.Description>
							<nav className="mbs-4" aria-label="Sections">
								<ul className="divide-border divide-y">
									{links.map((link) => {
										const isActive = link.id === activeId;

										return (
											<li key={link.id} className="px-1">
												<BottomSheet.Trigger
													action="dismiss"
													asChild
													onClick={() => {
														pendingTarget.current = link.id;
													}}
												>
													<button
														aria-current={isActive ? "true" : undefined}
														className={cn(
															"divide-border flex items-center-safe justify-between py-4 text-left text-lg transition-colors inline-full focus-visible:rounded-full",
															isActive
																? "text-foreground"
																: "hover:text-foreground focus-visible:text-foreground text-muted-foreground",
														)}
													>
														{link.label}
														<span
															className={cn(
																"bg-foreground size-1.5 rounded-full transition-opacity",
																isActive ? "opacity-100" : "opacity-0",
															)}
														/>
													</button>
												</BottomSheet.Trigger>
											</li>
										);
									})}
								</ul>
							</nav>

							<div className="border-border mbs-6 flex items-center-safe justify-between border-t pt-6">
								<span className="text-muted-foreground text-sm">Theme</span>
								{children}
							</div>
						</div>
					</BottomSheet.Content>
				</BottomSheet.View>
			</BottomSheet.Portal>
		</BottomSheet.Root>
	);
}
