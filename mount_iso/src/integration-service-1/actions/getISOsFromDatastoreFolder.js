/*-
 * #%L
 * mount_iso
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * @param {VC:Datastore} datastore
 * @param {string} folder
 *
 * @return {Array/string}
 */
(function (datastore, folder) {
	if (!datastore) return [""];

	function createQuery() {
		var query = new Array();
		query[0] = new VcIsoImageFileQuery();

		return query;
	}

	function createSearchSpec(query) {
		var searchSpec = new VcHostDatastoreBrowserSearchSpec();
		searchSpec.query = query;
		searchSpec.details = new VcFileQueryFlags();
		searchSpec.details.fileSize = true;
		searchSpec.details.fileOwner = true;
		searchSpec.details.modification = true;
		searchSpec.details.fileType = true;
		searchSpec.searchCaseInsensitive = true;
		searchSpec.sortFoldersFirst = true;
		return searchSpec;
	}

	function searchDatastore(datastoreBrowser, datastorePath, searchSpec) {
		return datastoreBrowser.searchDatastore_Task(datastorePath, searchSpec);
	}

	function extractIsoFilePaths(searchResults) {
		var isoPaths = [];
		for (var file of searchResults.file) {
			if (file instanceof VcIsoImageFileInfo) {
				isoPaths.push(file.path);
			}
		}
		return isoPaths;
	}

	function main(datastore, folder) {
		var datastoreBrowser = datastore.browser;
		var datastorePath = "[" + datastore.name + "] ";
		if (folder) datastorePath += folder;

		var query = createQuery();
		var searchSpec = createSearchSpec(query);
		var task = searchDatastore(datastoreBrowser, datastorePath, searchSpec);
		var searchResults = System.getModule(
			"com.vmware.library.vc.basic"
		).vim3WaitTaskEnd(task, false, 1);
		var isoPaths = extractIsoFilePaths(searchResults);
		System.log("ISOs: " + isoPaths);
		return isoPaths;
	}

	return main(datastore, folder);
});
