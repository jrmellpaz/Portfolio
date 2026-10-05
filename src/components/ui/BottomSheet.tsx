import { cn } from "@lib/utils";
import { Sheet } from "@silk-hq/components";
import type { ComponentProps } from "react";

// ================================================================================================
// Root
// ================================================================================================

type SheetRootProps = ComponentProps<typeof Sheet.Root>;
type BottomSheetRootProps = Omit<SheetRootProps, "license"> & {
	license?: SheetRootProps["license"];
};

function BottomSheetRoot({ children, ref, ...restProps }: BottomSheetRootProps) {
	return (
		<Sheet.Root license="commercial" {...restProps} ref={ref}>
			{children}
		</Sheet.Root>
	);
}

// ================================================================================================
// View
// ================================================================================================

function BottomSheetView({
	children,
	className,
	ref,
	...restProps
}: ComponentProps<typeof Sheet.View>) {
	return (
		<Sheet.View
			className={cn("isolate z-1 block-[calc(var(--silk-100-lvh-dvh-pct)+60px)]", className)}
			nativeEdgeSwipePrevention={true}
			{...restProps}
			ref={ref}
		>
			{children}
		</Sheet.View>
	);
}

// ================================================================================================
// Backdrop
// ================================================================================================

function BottomSheetBackdrop({
	className,
	ref,
	...restProps
}: ComponentProps<typeof Sheet.Backdrop>) {
	return <Sheet.Backdrop className={className} themeColorDimming="auto" {...restProps} ref={ref} />;
}

// ================================================================================================
// Content
// ================================================================================================

function BottomSheetContent({
	children,
	className,
	ref,
	...restProps
}: ComponentProps<typeof Sheet.Content>) {
	return (
		<Sheet.Content
			className={cn("box-border block-auto min-block-[100px]", className)}
			{...restProps}
			ref={ref}
		>
			<Sheet.BleedingBackground className="bg-card sheet-radius shadow-lg" />
			{children}
		</Sheet.Content>
	);
}

// ================================================================================================
// Unchanged Components
// ================================================================================================

const BottomSheetPortal = Sheet.Portal;
const BottomSheetTrigger = Sheet.Trigger;
const BottomSheetTitle = Sheet.Title;
const BottomSheetDescription = Sheet.Description;

export const BottomSheet = {
	Root: BottomSheetRoot,
	Portal: BottomSheetPortal,
	View: BottomSheetView,
	Backdrop: BottomSheetBackdrop,
	Content: BottomSheetContent,
	Trigger: BottomSheetTrigger,
	Title: BottomSheetTitle,
	Description: BottomSheetDescription,
};
