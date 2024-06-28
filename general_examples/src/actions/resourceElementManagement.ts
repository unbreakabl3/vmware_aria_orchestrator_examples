/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class ResourceElementManagement {
  /**
   * @rsName {string} rsName - Name of the ResourceElement
   * @rsPath {string} rsPath - Path of the ResourceElementCategory
   *
   * @returns {ResourceElement} - ResourceElement object
   */
  public getResourceElement({ rsName, rsPath }: { rsName: string; rsPath: string }): ResourceElement {
    System.log(`Attempting to get resource element with name: ${rsName} from path: ${rsPath}`);
    const rsCat = Server.getResourceElementCategoryWithPath(rsPath);
    if (!rsCat) {
      throw new Error(`Resource category not found for path: ${rsPath}`);
    }
    const resources = rsCat.resourceElements;
    if (!resources || resources.length === 0) {
      throw new Error(`No resource elements found in path: ${rsPath}`);
    }
    for (const resource of resources) {
      if (resource.name === rsName) {
        System.log(`Found resource element: ${resource.name}`);
        return resource;
      }
    }
    throw new Error(`Resource element with name: ${rsName} not found in path: ${rsPath}`);
  }

  /**
   * @param {ResourceElement} resourceElement - Resource element object
   * @param {MimeAttachment} mime - updated mime file
   * @returns {boolean} - True of false if the update was completed successfully
   */
  public updateResourceElement(resourceElement: ResourceElement, mime: MimeAttachment): boolean {
    System.log(`Attempting to update resource element: ${resourceElement.name}`);
    let result = false;
    try {
      resourceElement.setContentFromMimeAttachment(mime);
      result = true;
      System.log(`Successfully updated resource element: ${resourceElement.name}`);
    } catch (error) {
      throw new Error(`Failed to update resource element: ${resourceElement.name}: ${error}`);
    }

    return result;
  }
}
