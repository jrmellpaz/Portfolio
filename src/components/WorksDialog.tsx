import { useEffect, useRef, useState } from "react";
import { LongSheet } from "./ui/LongSheet";
import { CloseButton } from "./ui/CloseButton";

// The sheet chrome is React (Silk needs client state); each work's detail is authored as an Astro
// <template data-work-detail="…"> rendered by Works.astro. A delegated document click reads the
// clicked card's template HTML into state and presents the sheet — so only the active detail is ever
// live in the DOM, and reopening a different work just swaps the string (no stale slot to reconcile).

const getTemplate = (id: string) =>
	document.querySelector<HTMLTemplateElement>(`template[data-work-detail="${id}"]`);

// "/w1" → "w1" when that work exists; null for "/" and any other path.
const workIdFromUrl = (url: string) => {
	const path = new URL(url, location.origin).pathname.replace(/^\/|\/$/g, "");
	const id = decodeURIComponent(path);
	return id && getTemplate(id) ? id : null;
};

const isRoot = (url: string) => new URL(url, location.origin).pathname === "/";

export default function WorksDialog() {
	const [presented, setPresented] = useState(false);
	const [detailHtml, setDetailHtml] = useState("");
	const [workTitle, setWorkTitle] = useState("");
	// The card that opened the sheet — kept so we can release its held scale on close.
	const triggerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		// Load a work into the sheet. Never touches the URL — callers decide that.
		const openWork = (id: string) => {
			const template = getTemplate(id);
			if (!template) return;
			setDetailHtml(template.innerHTML);
			setWorkTitle(template.dataset.title ?? "");
			setPresented(true);
			// Hold the press scale on the opening card until the sheet closes. Looked up by id (not
			// event.target) so it also works for direct loads and back/forward.
			if (triggerRef.current) delete triggerRef.current.dataset.dialogActive;
			const trigger = document.querySelector<HTMLElement>(`[data-work-id="${id}"]`);
			triggerRef.current = trigger;
			if (trigger) trigger.dataset.dialogActive = "true";
		};

		const onClick = (event: MouseEvent) => {
			const trigger = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-work-id]");
			const id = trigger?.dataset.workId;
			if (!id || !getTemplate(id)) return;
			if ("navigation" in window) {
				// The navigate listener below opens the sheet.
				navigation.navigate(`/${encodeURIComponent(id)}`).finished.catch(() => {});
			} else {
				openWork(id);
			}
		};
		document.addEventListener("click", onClick);

		const onNavigate = (event: NavigateEvent) => {
			// `navigate` fires before the URL changes, so location is still where we're leaving from.
			const leavingWork = workIdFromUrl(location.href) !== null;
			if (!event.canIntercept || event.hashChange || event.downloadRequest !== null) return;

			const to = workIdFromUrl(event.destination.url);
			if (to) {
				// Card click, or back/forward onto a work URL: open the sheet. Scroll and focus are left
				// alone — the page is locked behind the sheet and Silk manages focus itself.
				event.intercept({
					scroll: "manual",
					focusReset: "manual",
					handler: async () => openWork(to),
				});
			} else if (leavingWork && isRoot(event.destination.url)) {
				// Back/forward (or our own replace) from a work URL to "/": close the sheet. Only this
				// case is intercepted so links to "/" from elsewhere keep their normal behavior.
				event.intercept({
					scroll: "manual",
					focusReset: "manual",
					handler: async () => setPresented(false),
				});
			}
		};

		if ("navigation" in window) navigation.addEventListener("navigate", onNavigate);

		// Direct load or refresh on /<id>: open that work.
		const initial = workIdFromUrl(location.href);
		if (initial) openWork(initial);

		return () => {
			document.removeEventListener("click", onClick);
			if ("navigation" in window) navigation.removeEventListener("navigate", onNavigate);
		};
	}, []);

	// Every user-driven close path (backdrop, swipe, escape, close button) ends up here. Closes that
	// come from history traversal don't: by then the URL is already "/", so there's nothing to undo.
	const handlePresentedChange = (next: boolean) => {
		setPresented(next);
		if (next || !presented || !workIdFromUrl(location.href)) return;

		if (!("navigation" in window)) {
			history.replaceState(history.state, "", "/");
			return;
		}

		// If the entry before this one is the page we came from, pop ours so history stays clean.
		// Otherwise (direct load on /<id>) there's nothing to go back to, so replace it with "/".
		const prev = navigation.entries()[(navigation.currentEntry?.index ?? 0) - 1];
		if (prev?.sameDocument && prev.url && isRoot(prev.url)) {
			navigation.back().finished.catch(() => {});
		} else {
			navigation.navigate("/", { history: "replace" }).finished.catch(() => {});
		}
	};

	// Release the held scale on every close path (backdrop, swipe, escape, close button).
	useEffect(() => {
		if (presented) return;
		const trigger = triggerRef.current;
		if (!trigger) return;
		delete trigger.dataset.dialogActive;
		triggerRef.current = null;
	}, [presented]);

	// On desktop Silk runs in non-replaced page-scroll mode and doesn't lock the page, so the body
	// keeps its own scrollbar behind the sheet. Lock <html> while presented; the stable scrollbar
	// gutter (globals.css) keeps the lock shift-free for the fixed navbar.
	useEffect(() => {
		if (!presented) return;
		const { style } = document.documentElement;
		const previous = style.overflow;
		style.overflow = "hidden";
		return () => {
			style.overflow = previous;
		};
	}, [presented]);

	// Prefix the page title with the open work's title; the cleanup puts the original back.
	useEffect(() => {
		if (!presented || !workTitle) return;
		const previous = document.title;
		document.title = `${workTitle} | ${previous}`;
		return () => {
			document.title = previous;
		};
	}, [presented, workTitle]);

	return (
		<LongSheet.Root presented={presented} onPresentedChange={handlePresentedChange}>
			<LongSheet.Portal>
				<LongSheet.View>
					<LongSheet.Backdrop />
					<LongSheet.Content>
						<div className="relative">
							<LongSheet.Title asChild>
								<h2 className="sr-only">Work details</h2>
							</LongSheet.Title>
							<LongSheet.Description asChild>
								<p className="sr-only">More information about the selected work.</p>
							</LongSheet.Description>

							<CloseButton
								onClick={() => handlePresentedChange(false)}
								className="absolute inset-e-4 inset-bs-4 z-10"
							/>

							<div dangerouslySetInnerHTML={{ __html: detailHtml }} />
						</div>
					</LongSheet.Content>
				</LongSheet.View>
			</LongSheet.Portal>
		</LongSheet.Root>
	);
}
