// import { DatastoreClusterManagement } from "../classes/datastoreClusterManagement";

// describe('DatastoreClusterManagement', () => {
//   let dcm: DatastoreClusterManagement;

//   beforeEach(() => {
//     dcm = new DatastoreClusterManagement();
//   });

//   describe('findStoragePod', () => {
//     let serverFindForTypeSpy: jasmine.Spy;

//     beforeEach(() => {
//       // @ts-ignore
//       Server = {
//         findForType: jasmine.createSpy('findForType')
//       };
//       serverFindForTypeSpy = Server.findForType as jasmine.Spy;
//     });

//     //TODO: Uncomment and implement the test when Server.findForType is available
//     // it('should call Server.findForType with correct arguments', () => {
//     //   const vimHostId = 'vim-123';
//     //   const datastoreClusterName = 'clusterA';
//     //   const fakePod = { id: 'pod-1' } as unknown as VcStoragePod;
//     //   serverFindForTypeSpy.and.returnValue(fakePod);

//     //   const result = dcm.findStoragePod(vimHostId, datastoreClusterName);

//     //   expect(serverFindForTypeSpy).toHaveBeenCalledWith('VC:StoragePod', `${vimHostId}/clusterName`);
//     //   expect(result).toEqual(fakePod);
//     // });

//     // it('should return the value from Server.findForType', () => {
//     //   const vimHostId = 'vim-456';
//     //   const datastoreClusterName = 'clusterB';
//     //   const expectedPod = { id: 'pod-2' } as unknown as VcStoragePod;
//     //   serverFindForTypeSpy.and.returnValue(expectedPod);

//     //   const result = dcm.findStoragePod(vimHostId, datastoreClusterName);

//     //   expect(result).toBe(expectedPod);
//     // });
//   });
// });