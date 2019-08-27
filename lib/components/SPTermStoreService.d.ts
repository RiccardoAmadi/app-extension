import { ISPTaxonomyPickerProps } from './ISPTaxonomyPickerProps';
/**
 * @interface
 * Generic Term Object (abstract interface)
 */
export interface ISPTermObject {
    name: string;
    guid: string;
}
/**
 * @class
 * Service implementation to manage term stores in SharePoint
 * Basic implementation taken from: https://oliviercc.github.io/sp-client-custom-fields/
 */
export declare class SPTermStoreService {
    private context;
    private props;
    private taxonomySession;
    private formDigest;
    /**
     * @function
     * Service constructor
     */
    constructor(props: ISPTaxonomyPickerProps);
    /**
     * @function
     * Gets the collection of term stores in the current SharePoint env
     */
    getTermsFromTermSet(termSet: string): Promise<ISPTermObject[]>;
    /**
     * @function
     * Clean the Guid from the Web Service response
     * @param guid
     */
    private cleanGuid;
}
//# sourceMappingURL=SPTermStoreService.d.ts.map