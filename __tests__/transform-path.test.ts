/**
 * GPT generated tests
 */

import { transformPath } from "../lib/transform-path";
import { expect, test, describe } from "vitest";

describe("transformPath", () => {
	test("transforms path with digits and hyphen", () => {
		const path = "/docs/0-einfuehrung/verwaltung-innovation";
		const transformedPath = transformPath(path);
		expect(transformedPath).toBe("/buch/einfuehrung/verwaltung-innovation");
	});

	test("transforms path with index", () => {
		const path = "/docs/0-einfuehrung/index";
		const transformedPath = transformPath(path);
		expect(transformedPath).toBe("/buch/einfuehrung/");
	});

	test("transforms path with multiple levels", () => {
		const path = "/docs/1-vorbereiten/02-prozess-planen";
		const transformedPath = transformPath(path);
		expect(transformedPath).toBe("/buch/vorbereiten/prozess-planen");
	});

	test("transforms path with multiple digits and hyphens", () => {
		const path = "/docs/3-erkennen/01-gespraechsbasis-erstellen";
		const transformedPath = transformPath(path);
		expect(transformedPath).toBe("/buch/erkennen/gespraechsbasis-erstellen");
	});
});
