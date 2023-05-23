export function transformPath(path: string): string {
	// Create a copy of the input parameter
	let transformedPath = path;
	// Replace digits followed by a hyphen with an empty string
	transformedPath = transformedPath.replace(/\d+-/g, "");
	// Replace the word 'docs' with 'buch'
	transformedPath = transformedPath.replace(/\/docs\//g, "buch/");
	// Remove the word 'index'
	transformedPath = transformedPath.replace(/\/index$/, "/");
	return transformedPath;
}
