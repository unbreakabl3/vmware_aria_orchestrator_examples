/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * getVmSnapshot.ts
 *
 * Get an array of snapshots
 *
 * @param {VC:VirtualMachine} vm - Virtual Machine
 * @returns {Array/VC:VirtualMachineSnapshot} - Array of snapshots
 */
(function getVmSnapshot(vm: VcVirtualMachine): Array<VcVirtualMachineSnapshot> {
  const snapshots: Array<VcVirtualMachineSnapshot> = [];
  if (vm?.snapshot?.rootSnapshotList) {
    const snapshotsTree = function traverseSnapshotTree(tree: VcVirtualMachineSnapshotTree) {
      snapshots.push(tree.snapshot);
      const childTrees: Array<VcVirtualMachineSnapshotTree> = tree.childSnapshotList?.filter(Boolean);
      if (childTrees?.length) {
        childTrees.forEach(traverseSnapshotTree);
      }
    };
    vm.snapshot.rootSnapshotList.forEach(snapshotsTree);
  }
  return snapshots;
});
