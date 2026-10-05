import { cn } from "@lib/utils";
import { Sheet, Scroll } from "@silk-hq/components";
import { createContext, useContext, useEffect, useRef, useState, type ComponentProps } from "react";

// ================================================================================================
// Context
// ================================================================================================

type LongSheetContextType = {
	setTrack: (track: "top" | "bottom") => void;
	restingOutside: boolean;
};

const LongSheetContext = createContext<LongSheetContextType | null>(null);

function useLongSheetContext() {
	const context = useContext(LongSheetContext);
	if (!context) {
		throw new Error("LongSheet.Content must be used within a LongSheet.View");
	}
	return context;
}

// ================================================================================================
// Root
// ================================================================================================

type SheetRootProps = ComponentProps<typeof Sheet.Root>;
type LongSheetRootProps = Omit<SheetRootProps, "license"> & {
	license?: SheetRootProps["license"];
};

function LongSheetRoot({ children, ref, ...restProps }: LongSheetRootProps) {
	return (
		<Sheet.Root license="commercial" {...restProps} ref={ref}>
			{children}
		</Sheet.Root>
	);
}

// ================================================================================================
// View
// ================================================================================================

function LongSheetView({
	children,
	className,
	ref,
	onTravelStatusChange,
	...restProps
}: ComponentProps<typeof Sheet.View>) {
	const [restingOutside, setRestingOutside] = useState(false);
	const [track, setTrack] = useState<"top" | "bottom">("bottom");

	useEffect(() => {
		if (restingOutside) {
			setTrack("bottom");
		}
	}, [restingOutside]);

	return (
		<LongSheetContext.Provider value={{ setTrack, restingOutside }}>
			<Sheet.View
				className={cn(
					"inset-bs-0 inset-be-[initial] isolate z-1 block-[calc(var(--silk-100-lvh-dvh-pct)+60px)]",
					className,
				)}
				contentPlacement="center"
				tracks={track}
				swipeOvershoot={false}
				nativeEdgeSwipePrevention={true}
				enteringAnimationSettings={{
					easing: "spring",
					stiffness: 480,
					damping: 45,
					mass: 1.5,
				}}
				onTravelStatusChange={(status) => {
					setRestingOutside(status === "idleOutside");
					onTravelStatusChange?.(status);
				}}
				{...restProps}
				ref={ref}
			>
				{children}
			</Sheet.View>
		</LongSheetContext.Provider>
	);
}

// ================================================================================================
// Backdrop
// ================================================================================================

function LongSheetBackdrop({
	className,
	ref,
	...restProps
}: ComponentProps<typeof Sheet.Backdrop>) {
	return (
		<Sheet.Backdrop
			className={cn("LongSheet-backdrop", className)}
			themeColorDimming="auto"
			{...restProps}
			ref={ref}
		/>
	);
}

// ================================================================================================
// Content
// ================================================================================================

type ScrollComponentRef = NonNullable<
	ComponentProps<typeof Scroll.Root>["componentRef"]
>["current"];
type ScrollEvent = Parameters<NonNullable<ComponentProps<typeof Scroll.View>["onScroll"]>>[0];

function LongSheetContent({
	children,
	className,
	ref,
	...restProps
}: ComponentProps<typeof Sheet.Content>) {
	const scrollRef = useRef<ScrollComponentRef>(null);
	const { setTrack, restingOutside } = useLongSheetContext();

	const scrollHandler = ({ progress }: ScrollEvent) => {
		if (restingOutside) return; // ! Checking because it may scroll to 1 when outside
		setTrack(progress < 0.5 ? "bottom" : "top");
	};

	return (
		<Sheet.Content className={cn("box-border", className)} asChild {...restProps} ref={ref}>
			<Scroll.Root
				className="size-full scroll-smooth bg-transparent"
				componentRef={scrollRef}
				asChild
			>
				<Scroll.View
					className="scrollbar-thumb-card-foreground/50 scrollbar-track-card"
					onScroll={scrollHandler}
				>
					<Scroll.Content className="grid place-items-center-safe px-4 block-auto">
						<div className="bg-card m-[max(env(safe-area-inset-top,0px),0.75rem)_env(safe-area-inset-right,0px)_max(env(safe-area-inset-bottom,0px),0.75rem)_env(safe-area-inset-left,0px)] overflow-clip rounded-3xl shadow-lg inline-full min-inline-0 md:inline-[min(calc(100%-1.5rem),1440px)]">
							{children}
						</div>
					</Scroll.Content>
				</Scroll.View>
			</Scroll.Root>
		</Sheet.Content>
	);
}

// ================================================================================================
// Unchanged Components
// ================================================================================================

const LongSheetPortal = Sheet.Portal;
const LongSheetTrigger = Sheet.Trigger;
const LongSheetHandle = Sheet.Handle;
const LongSheetOutlet = Sheet.Outlet;
const LongSheetTitle = Sheet.Title;
const LongSheetDescription = Sheet.Description;

export const LongSheet = {
	Root: LongSheetRoot,
	Portal: LongSheetPortal,
	View: LongSheetView,
	Backdrop: LongSheetBackdrop,
	Content: LongSheetContent,
	Trigger: LongSheetTrigger,
	Handle: LongSheetHandle,
	Outlet: LongSheetOutlet,
	Title: LongSheetTitle,
	Description: LongSheetDescription,
};
