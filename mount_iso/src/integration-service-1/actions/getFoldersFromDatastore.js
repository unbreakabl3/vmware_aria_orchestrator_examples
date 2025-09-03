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
 *
 * @return {Array/string}
 */
(function (datastore) {
	if (!datastore) return [""];

	function createQuery() {
		var query = new Array();
		query[0] = new VcFolderFileQuery();

		return query;
	}

	function createSearchSpec(query) {
		var searchSpec = new VcHostDatastoreBrowserSearchSpec();
		searchSpec.query = query;
		searchSpec.sortFoldersFirst = true;
		return searchSpec;
	}

	function searchDatastore(datastoreBrowser, datastorePath, searchSpec) {
		return datastoreBrowser.searchDatastore_Task(datastorePath, searchSpec);
	}

	function extractFolders(searchResults) {
		var folderPaths = [];
		for (var file of searchResults.file) {
			if (file instanceof VcFolderFileInfo) {
				folderPaths.push(file.path);
			}
		}
		return folderPaths;
	}

	function main(datastore) {
		var datastoreBrowser = datastore.browser;
		var datastorePath = "[" + datastore.name + "] ";

		var query = createQuery();
		var searchSpec = createSearchSpec(query);
		var task = searchDatastore(datastoreBrowser, datastorePath, searchSpec);
		var searchResults = System.getModule(
			"com.vmware.library.vc.basic"
		).vim3WaitTaskEnd(task, false, 1);
		var folders = extractFolders(searchResults);
		System.log("Folders: " + folders);
		return folders; // Return the array of paths
	}

	return main(datastore);
});
