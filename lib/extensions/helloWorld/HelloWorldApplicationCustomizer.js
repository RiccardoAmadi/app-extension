var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import * as strings from 'HelloWorldApplicationCustomizerStrings';
import styles from './AppCustomizer.module.scss';
var LOG_SOURCE = 'HelloWorldApplicationCustomizer';
/** A Custom Action which can be run during execution of a Client Side Application */
var HelloWorldApplicationCustomizer = /** @class */ (function (_super) {
    __extends(HelloWorldApplicationCustomizer, _super);
    function HelloWorldApplicationCustomizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HelloWorldApplicationCustomizer.prototype.onInit = function () {
        Log.info(LOG_SOURCE, "Initialized " + strings.Title);
        // Wait for the placeholders to be created (or handle them being changed) and then
        // render.
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
        return Promise.resolve();
    };
    HelloWorldApplicationCustomizer.prototype._renderPlaceHolders = function () {
        console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
        console.log("Available placeholders: ", this.context.placeholderProvider.placeholderNames
            .map(function (name) { return PlaceholderName[name]; })
            .join(", "));
        // Handling the bottom placeholder
        if (!this._bottomPlaceholder) {
            this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom, { onDispose: this._onDispose });
            // The extension should not assume that the expected placeholder is available.
            if (!this._bottomPlaceholder) {
                console.error("The expected placeholder (Bottom) was not found.");
                return;
            }
            if (this.properties) {
                var bottomString = this.properties.Bottom;
                if (!bottomString) {
                    bottomString = "(Bottom property was not defined.)";
                }
                if (this._bottomPlaceholder.domElement) {
                    this._bottomPlaceholder.domElement.innerHTML = "\n          <div class=\"" + styles.app + "\">\n            <div class=\"" + styles.bottom + "\">\n            \n              <a class=\"" + styles.bottom_links + "\" href=\"https://mcquayit.sharepoint.com\">\n                <div class=\"\">\n                  <div class=\"" + styles.button_text_container + "\">\n                    <div class=\"\" id=\"\">Contatti</div>\n                  </div>\n                </div>              \n              </a>\n\n              <a class=\"" + styles.bottom_links + "\" href=\"https://mcquayit.sharepoint.com\">\n                <div class=\"\">\n                  <div class=\"" + styles.button_text_container + "\">\n                    <div class=\"\" id=\"\">Legal Policies</div>\n                  </div>\n                </div>              \n              </a>\n\n            </div>\n          </div>";
                }
            }
        }
    };
    HelloWorldApplicationCustomizer.prototype._onDispose = function () {
        console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom bottom placeholders.');
    };
    __decorate([
        override
    ], HelloWorldApplicationCustomizer.prototype, "onInit", null);
    return HelloWorldApplicationCustomizer;
}(BaseApplicationCustomizer));
export default HelloWorldApplicationCustomizer;
//# sourceMappingURL=HelloWorldApplicationCustomizer.js.map