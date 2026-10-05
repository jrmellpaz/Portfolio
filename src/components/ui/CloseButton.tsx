import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";
import { cn } from "@lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";

// Shared circular dismiss button used by the MobileNav sheet and the WorksDialog. All extra props
// (and the ref) are spread onto the underlying <button> so Silk's `asChild` Trigger can clone this
// component and inject its own onClick/data attributes onto the real element.

export function CloseButton({
	className,
	type = "button",
	"aria-label": ariaLabel = "Close",
	...restProps
}: ComponentProps<"button">) {
	return (
		<button
			type={type}
			aria-label={ariaLabel}
			className={cn(
				"hover:text-foreground focus-visible:text-foreground grid size-[30px] cursor-pointer place-items-center rounded-full border-none bg-[color-mix(in_srgb,var(--muted-foreground)_22%,transparent)] text-[color-mix(in_srgb,var(--foreground)_60%,transparent)] [transition:background-color_0.15s_ease,color_0.15s_ease] hover:bg-[color-mix(in_srgb,var(--muted-foreground)_32%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--muted-foreground)_32%,transparent)]",
				className,
			)}
			{...restProps}
		>
			<HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={3} aria-hidden focusable={false} />
		</button>
	);
}
