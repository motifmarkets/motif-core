/**
 * %license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AdiService } from './adi/adi-internal-api';
import { CommandRegisterService } from "./command/command-internal-api";
import {
    setTableDefinitionFactory,
    setTableDirectory,
    setTableRecordDefinitionListDirectory,
    setTableRecordDefinitionListFactory,
    TableDefinitionFactory,
    TableRecordDefinitionListFactory,
    TableRecordDefinitionListsService,
    TablesService
} from "./grid/grid-internal-api";
import { KeyboardService } from "./keyboard/keyboard-internal-api";
import { LitIvemIdListsService, ScansService } from './lists/lists-internal-api';
import {
    AppStorageService,
    CapabilitiesService,
    MotifServicesService,
    setSymbolDetailCache,
    SymbolDetailCache,
    SymbolsService
} from "./services/services-internal-api";
import { SettingsService } from './settings/settings-internal-api';
import { MultiEvent } from './sys/sys-internal-api';
import {
    textFormatter,
    TextFormatter,
    TextFormatterModule
} from "./text-format/text-format-internal-api";
// import { textFormatter } from './text-formatter';

export class CoreService {
    private _finalised = false;

    private readonly _settingsService: SettingsService;
    private readonly _motifServicesService: MotifServicesService;
    private readonly _appStorageService: AppStorageService;
    private readonly _adiService: AdiService;
    private readonly _capabilitiesService: CapabilitiesService;
    private readonly _symbolsService: SymbolsService;
    private readonly _scansService: ScansService;
    private readonly _litIvemIdListsService: LitIvemIdListsService;
    private readonly _commandRegisterService: CommandRegisterService;
    private readonly _keyboardService: KeyboardService;

    private _settingsChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _activeColorSchemeName: string;

    constructor() {
        this._settingsService = new SettingsService();
        this._motifServicesService = new MotifServicesService(this._settingsService);
        this._appStorageService = new AppStorageService(this._motifServicesService);
        this._adiService = new AdiService();
        this._capabilitiesService = new CapabilitiesService();
        this._symbolsService = new SymbolsService(this._settingsService, this._adiService);
        this._scansService = new ScansService(this._adiService);
        this._litIvemIdListsService = new LitIvemIdListsService(this._scansService);
        this._commandRegisterService = new CommandRegisterService();
        this._keyboardService = new KeyboardService();

        setSymbolDetailCache(new SymbolDetailCache(this._adiService.dataMgr, this._symbolsService));
        setTableRecordDefinitionListFactory(new TableRecordDefinitionListFactory(
            this._adiService,
            this._symbolsService,
        ));
        setTableDefinitionFactory(new TableDefinitionFactory(this._adiService));
        setTableRecordDefinitionListDirectory(new TableRecordDefinitionListsService());
        setTableDirectory(new TablesService());
        TextFormatterModule.setTextFormatter(new TextFormatter(this._symbolsService, this._settingsService));

        this._settingsChangedSubscriptionId = this._settingsService.subscribeSettingsChangedEvent(() => {
            this.handleSettingsChanged();
        });
    }

    get settingsService() { return this._settingsService; }
    get motifServicesService() { return this._motifServicesService; }
    get appStorageService() { return this._appStorageService; }
    get adiService() { return this._adiService; }
    get capabilitiesService() { return this._capabilitiesService; }
    get symbolsService() { return this._symbolsService; }
    get scansService() { return this._scansService; }
    get litIvemIdListsService() { return this._litIvemIdListsService; }
    get commandRegisterService() { return this._commandRegisterService; }
    get keyboardService() { return this._keyboardService; }

    finalise() {
        if (!this._finalised) {
            this._motifServicesService.finalise();
            this._settingsService.unsubscribeSettingsChangedEvent(this._settingsChangedSubscriptionId);
            this._settingsChangedSubscriptionId = undefined;

            textFormatter.finalise();
            this._litIvemIdListsService.finalise();
            this._scansService.finalise();
            this._symbolsService.finalise();
        }
    }

    private handleSettingsChanged(): void {

        // const colorSchemeName = this._settings.appearance.activeColorSchemeName || ColorSchemePreset.DARK_PRESET_NAME;
        // if (this._activeColorSchemeName !== colorSchemeName) {
        //     this._activeColorSchemeName = colorSchemeName;
        //     this.loadColorScheme(this._activeColorSchemeName);
        // }
    }

    // private updateCssVariables(): void {

    //     // #CodeLink[15141146197] Define CSS variables.

    //     function replaceEmptyColorString(value: string): string {
    //         return value.trim() === ''
    //             ? 'inherit'
    //             : value;
    //     }

    //     const motifRoot = document.querySelector('#motif-root');
    //     assert(assigned(motifRoot), 'ID:20919132025');

    //     ColorScheme.Item.getAll()
    //         .filter(ColorScheme.Item.idIsCssVariable)
    //         .forEach(id => {
    //             if (ColorScheme.Item.idHasFore(id)) {
    //                 const cssVarName = ColorScheme.Item.idToForeCssVariableName(id);
    //                 const cssVarValue = replaceEmptyColorString(this._settings.colorScheme.getForeColor(id));
    //                 (motifRoot as HTMLElement).style.setProperty(cssVarName, cssVarValue);
    //             }
    //             if (ColorScheme.Item.idHasBkgd(id)) {
    //                 const cssVarName = ColorScheme.Item.idToBkgdCssVariableName(id);
    //                 const cssVarValue = replaceEmptyColorString(this._settings.colorScheme.getBkgdColor(id));
    //                 (motifRoot as HTMLElement).style.setProperty(cssVarName, cssVarValue);
    //             }
    //         });
    // }
}
