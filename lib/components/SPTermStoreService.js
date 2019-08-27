import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';
/**
 * @class
 * Service implementation to manage term stores in SharePoint
 * Basic implementation taken from: https://oliviercc.github.io/sp-client-custom-fields/
 */
var SPTermStoreService = /** @class */ (function () {
    /**
     * @function
     * Service constructor
     */
    function SPTermStoreService(props) {
        this.props = props;
        this.context = props.context;
    }
    /**
     * @function
     * Gets the collection of term stores in the current SharePoint env
     */
    SPTermStoreService.prototype.getTermsFromTermSet = function (termSet) {
        var _this = this;
        if (Environment.type === EnvironmentType.SharePoint ||
            Environment.type === EnvironmentType.ClassicSharePoint) {
            //First gets the FORM DIGEST VALUE
            var contextInfoUrl = this.context.pageContext.web.absoluteUrl + "/_api/contextinfo";
            var httpPostOptions = {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json"
                }
            };
            return this.context.spHttpClient.post(contextInfoUrl, SPHttpClient.configurations.v1, httpPostOptions).then(function (response) {
                return response.json().then(function (jsonResponse) {
                    _this.formDigest = jsonResponse.FormDigestValue;
                    //Build the Client Service Request
                    var clientServiceUrl = _this.context.pageContext.web.absoluteUrl + '/_vti_bin/client.svc/ProcessQuery';
                    var data = '<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="JavaScript Client" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="2" ObjectPathId="1" /><ObjectIdentityQuery Id="3" ObjectPathId="1" /><ObjectPath Id="5" ObjectPathId="4" /><ObjectIdentityQuery Id="6" ObjectPathId="4" /><ObjectPath Id="8" ObjectPathId="7" /><Query Id="9" ObjectPathId="7"><Query SelectAllProperties="false"><Properties /></Query><ChildItemQuery SelectAllProperties="false"><Properties><Property Name="Terms" SelectAll="true"><Query SelectAllProperties="false"><Properties /></Query></Property></Properties></ChildItemQuery></Query></Actions><ObjectPaths><StaticMethod Id="1" Name="GetTaxonomySession" TypeId="{981cbc68-9edc-4f8d-872f-71146fcbb84f}" /><Method Id="4" ParentId="1" Name="GetDefaultSiteCollectionTermStore" /><Method Id="7" ParentId="4" Name="GetTermSetsByName"><Parameters><Parameter Type="String">' + termSet + '</Parameter><Parameter Type="Int32">1033</Parameter></Parameters></Method></ObjectPaths></Request>';
                    httpPostOptions = {
                        headers: {
                            'accept': 'application/json',
                            'content-type': 'application/json',
                            "X-RequestDigest": _this.formDigest
                        },
                        body: data
                    };
                    return _this.context.spHttpClient.post(clientServiceUrl, SPHttpClient.configurations.v1, httpPostOptions).then(function (serviceResponse) {
                        return serviceResponse.json().then(function (serviceJSONResponse) {
                            var result = new Array();
                            serviceJSONResponse.forEach(function (child) {
                                if (child != null && child['_ObjectType_'] !== undefined) {
                                    var termSetCollectionType = child['_ObjectType_'];
                                    if (termSetCollectionType === "SP.Taxonomy.TermSetCollection") {
                                        var childTermSets = child['_Child_Items_'];
                                        childTermSets.forEach(function (ts) {
                                            var termSetType = ts['_ObjectType_'];
                                            if (termSetType === "SP.Taxonomy.TermSet") {
                                                var termCollection = ts['Terms'];
                                                var childTerms = termCollection['_Child_Items_'];
                                                childTerms.forEach(function (t) {
                                                    var termType = t['_ObjectType_'];
                                                    if (termType === "SP.Taxonomy.Term") {
                                                        result.push({ guid: _this.cleanGuid(t['Id']), name: t["Name"] });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                            return (result);
                        });
                    });
                });
            });
        }
        else {
            return (new Promise(function (resolve, reject) {
                resolve(new Array());
            }));
        }
    };
    /**
     * @function
     * Clean the Guid from the Web Service response
     * @param guid
     */
    SPTermStoreService.prototype.cleanGuid = function (guid) {
        if (guid !== undefined)
            return guid.replace('/Guid(', '').replace('/', '').replace(')', '');
        else
            return '';
    };
    return SPTermStoreService;
}());
export { SPTermStoreService };
//# sourceMappingURL=SPTermStoreService.js.map