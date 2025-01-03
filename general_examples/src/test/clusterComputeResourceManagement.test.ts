import { ClusterComputeResourceManagement, InvalidClusterError } from "../actions/clusterComputeResourceManagement";

describe("ClusterManagement", () => {
  let clusterManagement: ClusterComputeResourceManagement;

  beforeEach(() => {
    clusterManagement = new ClusterComputeResourceManagement();
  });

  it("should throw an error if cluster is not provided", () => {
    expect(() => {
      clusterManagement.getAllvcHostsOfCluster(null as any);
    }).toThrow("Cluster input is not provided or is invalid.");
  });

  it("should throw an error if no hosts are found in the cluster", () => {
    const mockCluster = {
      name: "TestCluster",
      host: []
    } as any;

    expect(() => {
      clusterManagement.getAllvcHostsOfCluster(mockCluster);
    }).toThrow(new InvalidClusterError("Error: No hosts found in the cluster 'TestCluster'."));
  });

  it("should return hosts if hosts are found in the cluster", () => {
    const mockHosts = [{}, {}] as any;
    const mockCluster = {
      name: "TestCluster",
      host: mockHosts
    } as any;

    const hosts = clusterManagement.getAllvcHostsOfCluster(mockCluster);
    expect(hosts).toBe(mockHosts);
  });

  it("should log the number of hosts found in the cluster", () => {
    const mockHosts = [{}, {}] as any;
    const mockCluster = {
      name: "TestCluster",
      host: mockHosts
    } as any;

    const logSpy = spyOn(System, "log");
    clusterManagement.getAllvcHostsOfCluster(mockCluster);
    expect(logSpy).toHaveBeenCalledWith("2 hosts found in the cluster 'TestCluster'");
  });
});
