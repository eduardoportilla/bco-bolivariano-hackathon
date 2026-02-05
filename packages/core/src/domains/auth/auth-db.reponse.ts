// To parse this data:
//
//   import { Convert, AuthResponseBD } from "./file";
//
//   const authResponseBD = Convert.toAuthResponseBD(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AuthResponseBD {
    code: number;
    responseType: string;
    message: string;
    content: Content;
}

export interface Content {
    infoUser: InfoUser;
    accessToken: string;
    catalogues: Catalogues;
    conversionCatalogues: ConversionCatalogues;
    configuration: Configuration;
    allowRegisterBiometric: boolean;
    allowRegisterDevice: boolean;
    forceRegisterPushToken: boolean;
    isTemporalPassword: boolean;
    hasPromotionalCampaign: boolean;
    enableSurveys: boolean;
    userBankId: number;
    getContractBalanceResponse: GetContractBalanceResponse;
    getFrequentPaymentResponse: GetFrequentPaymentResponse;
    inputControlValidations: InputControlValidations;
    contract: Contract;
    promotionsComponent: PromotionsComponent[];
    featuredActions: FeaturedActions;
    ownerBankCode: string;
    operationSecurityAction: string;
    softTokenState: string;
    verifySuccessfulLogin: boolean;
}

export interface Catalogues {
    IdentificationType: IdentificationType;
    AccountType: CataloguesAccountType;
    BrandCardType: { [key: string]: string };
    TransactionCategoryType: TransactionCategoryType;
    BankBrandCreditCardType: { [key: string]: string };
    ReasonBlockStatusCard: { [key: string]: string };
    EmploymentRelationshipType: { [key: string]: string };
    HousingType: { [key: string]: string };
    LevelEducationType: { [key: string]: string };
    DependentEconomicActivityType: { [key: string]: string };
    BankBrandDebitCardType: BankBrandDebitCardType;
}

export interface CataloguesAccountType {
    C: string;
    A: string;
}

export interface BankBrandDebitCardType {
    Default: string;
}

export interface IdentificationType {
    C: string;
    P: string;
    U: string;
    R?: string;
}

export interface TransactionCategoryType {
    CH: string;
    DP: string;
    NC: string;
    ND: string;
    RT: string;
}

export interface Configuration {
    language: string;
    sessionTimeSeconds: number;
    refreshTokenSeconds: number;
    searchAllTypeTransactionCode: string;
    hourDurationLog: number;
    sendLog: boolean;
    queryFilterMilisecondsTimeConfiguration: QueryFilterMilisecondsTimeConfiguration;
    hasMaximiunDevicesAllowed: boolean;
    maximiunDevicesAllowed: number;
    forceRemoveDevice: boolean;
    securityMethodsByActions: { [key: string]: SecurityMethodsByAction[] | null };
    typeTransactionMap: TypeTransactionMap;
    imageConfiguration: ImageConfiguration;
    paginationConfiguration: PaginationConfiguration;
    hasCampaign: boolean;
    bannerPromotionConfiguration: BannerPromotionConfiguration;
    secondsDifferenceAllowedToken: number;
    softTokenValidationPaths: string[];
    lastUpdatedUserInformationDate: Date;
    allowUpdateUserInformation: boolean;
}

export interface BannerPromotionConfiguration {
    repetitiveBanners: boolean;
    dynamicMiliseconds: number;
}

export interface ImageConfiguration {
    AliasDevice: AliasDevice;
    CheckBack: AliasDevice;
    CheckFront: AliasDevice;
}

export interface AliasDevice {
    widthMaximumSize: number;
    maximumWeightSizeKiloBytes: number;
    compressPercentage: number;
    supportedExtensions: string[];
    enable: boolean;
}

export interface PaginationConfiguration {
    Account: AccountClass;
    Card: AccountClass;
    Credit: AccountClass;
}

export interface AccountClass {
    minimunConsultationDate: Date;
    maximunConsultationDays: number;
    initialDefaultDate: Date;
}

export interface QueryFilterMilisecondsTimeConfiguration {
    QUERY_FILTER_TIME_NOTIFICATION: number;
    QUERY_FILTER_SERVICES_REGISTERED: number;
}

export enum SecurityMethodsByAction {
    BankTotp = "BankTotp",
    Otp = "Otp",
    Question = "Question",
}

export interface TypeTransactionMap {
    National: string[];
}

export interface Contract {
}

export interface ConversionCatalogues {
    IdentificationType: IdentificationType;
    AccountType: ConversionCataloguesAccountType;
    BrandCardType: { [key: string]: string };
    BankBrandCreditCardType: { [key: string]: string };
    EmploymentRelationshipType: { [key: string]: string };
    HousingType: { [key: string]: string };
    LevelEducationType: { [key: string]: string };
    DependentEconomicActivityType: { [key: string]: string };
    BankBrandDebitCardType: BankBrandDebitCardType;
    GoalsForScheduledSavings: GoalsForScheduledSavings;
}

export interface ConversionCataloguesAccountType {
    A: string;
    C: string;
    T: string;
}

export interface GoalsForScheduledSavings {
    "0005": string;
}

export interface FeaturedActions {
    "2": string;
}

export interface GetContractBalanceResponse {
    maxAmount: number;
    minAmount: number;
    accounts: AccountElement[];
    deposits: any[];
    loans: any[];
    cards: any[];
    userMessage: string;
}

export interface AccountElement {
    accountId: number;
    accountIdentifier: string;
    accountNumber: string;
    allowDownloadStatements: boolean;
    accountTypeCode: DocumentType;
    accountType: string;
    accountTypeLabel: string;
    accountOwnerName: string;
    accountAliasName: string;
    relationTypeCode: string;
    isFavorite: boolean;
    balances: Balance[];
    transactionType: string;
    allowAdditionalCard: boolean;
    allowNewCard: boolean;
    allowBalanceDebit: boolean;
    allowBalanceCredit: boolean;
    institutionCode: string;
    institutionName: string;
    beneficiaryTypeCode: BeneficiaryTypeCode;
    typeTransactionConfigurations: TypeTransactionConfiguration[];
    scheduledSaving: ScheduledSaving[];
    predefinedAmounts: PredefinedAmounts;
}

export enum DocumentType {
    A = "A",
    C = "C",
    T = "T",
}

export interface Balance {
    balanceType: string;
    amount: number;
    currency: string;
}

export enum BeneficiaryTypeCode {
    CreditCards = "CreditCards",
    OtherBankAccount = "OtherBankAccount",
    OwnerBankAccount = "OwnerBankAccount",
}

export interface PredefinedAmounts {
    "$ 10": number;
    "$ 20": number;
    "$ 30": number;
    "$ 100": number;
}

export interface ScheduledSaving {
    scheduledSavingId: number;
    amount: number;
}

export interface TypeTransactionConfiguration {
    transactionType: string;
    maxAmountByTransaction: number;
    maxAmountByTransactionAllowed: number;
    maxAmountDaily: number;
    maxAmountDailyAllowed: number;
    minAmountByTransation: number;
}

export interface GetFrequentPaymentResponse {
    userMessage: string;
    genericBeneficiaries: GenericBeneficiary[];
}

export interface GenericBeneficiary {
    serviceDescription: string;
    nickName: string;
    sequential: number;
    beneficiaryTransaction?: BeneficiaryTransaction;
    iconCode?: string;
    beneficiaryService?: BeneficiaryService;
}

export interface BeneficiaryService {
    serviceId: number;
    nickname: string;
    requiredEditFields: RequiredEditField[];
    serviceIdentifier: string;
    businessSelectionLabel: string;
    serviceTypeCode: string;
    serviceTypeDescription: string;
    serviceTypeIcon: string;
    serviceCode: string;
    serviceDescription: string;
    serviceIcon: string;
    businessDescription: string;
    methodPaymentflow: string;
    debitProductTaxes: DebitProductTaxes;
    isNewService: boolean;
    isRegistrationRequired: boolean;
    showPaymentLabelsInPaymetPage: boolean;
}

export interface DebitProductTaxes {
    Accounts: Accounts;
    CreditCards: Accounts;
}

export interface Accounts {
    Tarifa: number;
}

export interface RequiredEditField {
    value: string;
    visualResumen: boolean;
    isEditable: boolean;
    parameter: string;
    displayInStep: string;
    label: string;
    showInRegister: boolean;
    showInEdit: boolean;
    isItemAmountField: boolean;
    type: string;
    regex: string;
    values: any[];
    showConditions: any[];
    enableConditions: any[];
    requiredConditions: any[];
}

export interface BeneficiaryTransaction {
    beneficiaryId: number;
    beneficiaryIdentifier: string;
    beneficiaryIdentifierType: BeneficiaryIdentifierType;
    beneficiaryTypeCode: BeneficiaryTypeCode;
    beneficiaryName: string;
    beneficiaryContractNumber: string;
    beneficiaryInstitutionCode: string;
    beneficiaryInstitutionName: string;
    beneficiaryAlias: string;
    accountType: DocumentType;
    isFavorite: boolean;
    sequential: number;
    creditCardType?: string;
    transactionType: TransactionType;
    email?: string;
}

export enum BeneficiaryIdentifierType {
    C = "C",
    R = "R",
}

export enum TransactionType {
    Interbank = "Interbank",
    OtherOwnerBankAccount = "OtherOwnerBankAccount",
}

export interface InfoUser {
    fullName: string;
    urlProfileImage: string;
    userAlias: string;
    documentType: DocumentType;
    documentNumber: string;
    phoneNumber: string;
    email: string;
    username: string;
    lastSession: Date;
}

export interface InputControlValidations {
    QrNotificationPhoneNumber: QrNotificationPhoneNumber;
}

export interface QrNotificationPhoneNumber {
    validations: Validations;
    restrictions: string[];
}

export interface Validations {
    "^09": string;
    "^\\d{10}$": string;
}

export interface PromotionsComponent {
    backGround: BackGround;
    title: Description;
    description: Description;
    border: Border;
    button: Button;
}

export interface BackGround {
    url: string;
    type: string;
}

export interface Border {
    whiteHexadecimalColor?: HexadecimalColor;
    blackHexadecimalColor?: HexadecimalColor;
}

export enum HexadecimalColor {
    The000000 = "#000000",
    The0D6Efd = "#0d6efd",
    The560B0B = "#560b0b",
}

export interface Button {
    backGround: Border;
    color: Border;
}

export interface Description {
    color: Contract;
    text: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAuthResponseBD(json: string): AuthResponseBD {
        return cast(JSON.parse(json), r("AuthResponseBD"));
    }

    public static authResponseBDToJson(value: AuthResponseBD): string {
        return JSON.stringify(uncast(value, r("AuthResponseBD")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) { }
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "AuthResponseBD": o([
        { json: "code", js: "code", typ: 0 },
        { json: "responseType", js: "responseType", typ: "" },
        { json: "message", js: "message", typ: "" },
        { json: "content", js: "content", typ: r("Content") },
    ], false),
    "Content": o([
        { json: "infoUser", js: "infoUser", typ: r("InfoUser") },
        { json: "accessToken", js: "accessToken", typ: "" },
        { json: "catalogues", js: "catalogues", typ: r("Catalogues") },
        { json: "conversionCatalogues", js: "conversionCatalogues", typ: r("ConversionCatalogues") },
        { json: "configuration", js: "configuration", typ: r("Configuration") },
        { json: "allowRegisterBiometric", js: "allowRegisterBiometric", typ: true },
        { json: "allowRegisterDevice", js: "allowRegisterDevice", typ: true },
        { json: "forceRegisterPushToken", js: "forceRegisterPushToken", typ: true },
        { json: "isTemporalPassword", js: "isTemporalPassword", typ: true },
        { json: "hasPromotionalCampaign", js: "hasPromotionalCampaign", typ: true },
        { json: "enableSurveys", js: "enableSurveys", typ: true },
        { json: "userBankId", js: "userBankId", typ: 0 },
        { json: "getContractBalanceResponse", js: "getContractBalanceResponse", typ: r("GetContractBalanceResponse") },
        { json: "getFrequentPaymentResponse", js: "getFrequentPaymentResponse", typ: r("GetFrequentPaymentResponse") },
        { json: "inputControlValidations", js: "inputControlValidations", typ: r("InputControlValidations") },
        { json: "contract", js: "contract", typ: r("Contract") },
        { json: "promotionsComponent", js: "promotionsComponent", typ: a(r("PromotionsComponent")) },
        { json: "featuredActions", js: "featuredActions", typ: r("FeaturedActions") },
        { json: "ownerBankCode", js: "ownerBankCode", typ: "" },
        { json: "operationSecurityAction", js: "operationSecurityAction", typ: "" },
        { json: "softTokenState", js: "softTokenState", typ: "" },
        { json: "verifySuccessfulLogin", js: "verifySuccessfulLogin", typ: true },
    ], false),
    "Catalogues": o([
        { json: "IdentificationType", js: "IdentificationType", typ: r("IdentificationType") },
        { json: "AccountType", js: "AccountType", typ: r("CataloguesAccountType") },
        { json: "BrandCardType", js: "BrandCardType", typ: m("") },
        { json: "TransactionCategoryType", js: "TransactionCategoryType", typ: r("TransactionCategoryType") },
        { json: "BankBrandCreditCardType", js: "BankBrandCreditCardType", typ: m("") },
        { json: "ReasonBlockStatusCard", js: "ReasonBlockStatusCard", typ: m("") },
        { json: "EmploymentRelationshipType", js: "EmploymentRelationshipType", typ: m("") },
        { json: "HousingType", js: "HousingType", typ: m("") },
        { json: "LevelEducationType", js: "LevelEducationType", typ: m("") },
        { json: "DependentEconomicActivityType", js: "DependentEconomicActivityType", typ: m("") },
        { json: "BankBrandDebitCardType", js: "BankBrandDebitCardType", typ: r("BankBrandDebitCardType") },
    ], false),
    "CataloguesAccountType": o([
        { json: "C", js: "C", typ: "" },
        { json: "A", js: "A", typ: "" },
    ], false),
    "BankBrandDebitCardType": o([
        { json: "Default", js: "Default", typ: "" },
    ], false),
    "IdentificationType": o([
        { json: "C", js: "C", typ: "" },
        { json: "P", js: "P", typ: "" },
        { json: "U", js: "U", typ: "" },
        { json: "R", js: "R", typ: u(undefined, "") },
    ], false),
    "TransactionCategoryType": o([
        { json: "CH", js: "CH", typ: "" },
        { json: "DP", js: "DP", typ: "" },
        { json: "NC", js: "NC", typ: "" },
        { json: "ND", js: "ND", typ: "" },
        { json: "RT", js: "RT", typ: "" },
    ], false),
    "Configuration": o([
        { json: "language", js: "language", typ: "" },
        { json: "sessionTimeSeconds", js: "sessionTimeSeconds", typ: 0 },
        { json: "refreshTokenSeconds", js: "refreshTokenSeconds", typ: 0 },
        { json: "searchAllTypeTransactionCode", js: "searchAllTypeTransactionCode", typ: "" },
        { json: "hourDurationLog", js: "hourDurationLog", typ: 0 },
        { json: "sendLog", js: "sendLog", typ: true },
        { json: "queryFilterMilisecondsTimeConfiguration", js: "queryFilterMilisecondsTimeConfiguration", typ: r("QueryFilterMilisecondsTimeConfiguration") },
        { json: "hasMaximiunDevicesAllowed", js: "hasMaximiunDevicesAllowed", typ: true },
        { json: "maximiunDevicesAllowed", js: "maximiunDevicesAllowed", typ: 0 },
        { json: "forceRemoveDevice", js: "forceRemoveDevice", typ: true },
        { json: "securityMethodsByActions", js: "securityMethodsByActions", typ: m(u(a(r("SecurityMethodsByAction")), null)) },
        { json: "typeTransactionMap", js: "typeTransactionMap", typ: r("TypeTransactionMap") },
        { json: "imageConfiguration", js: "imageConfiguration", typ: r("ImageConfiguration") },
        { json: "paginationConfiguration", js: "paginationConfiguration", typ: r("PaginationConfiguration") },
        { json: "hasCampaign", js: "hasCampaign", typ: true },
        { json: "bannerPromotionConfiguration", js: "bannerPromotionConfiguration", typ: r("BannerPromotionConfiguration") },
        { json: "secondsDifferenceAllowedToken", js: "secondsDifferenceAllowedToken", typ: 0 },
        { json: "softTokenValidationPaths", js: "softTokenValidationPaths", typ: a("") },
        { json: "lastUpdatedUserInformationDate", js: "lastUpdatedUserInformationDate", typ: Date },
        { json: "allowUpdateUserInformation", js: "allowUpdateUserInformation", typ: true },
    ], false),
    "BannerPromotionConfiguration": o([
        { json: "repetitiveBanners", js: "repetitiveBanners", typ: true },
        { json: "dynamicMiliseconds", js: "dynamicMiliseconds", typ: 0 },
    ], false),
    "ImageConfiguration": o([
        { json: "AliasDevice", js: "AliasDevice", typ: r("AliasDevice") },
        { json: "CheckBack", js: "CheckBack", typ: r("AliasDevice") },
        { json: "CheckFront", js: "CheckFront", typ: r("AliasDevice") },
    ], false),
    "AliasDevice": o([
        { json: "widthMaximumSize", js: "widthMaximumSize", typ: 0 },
        { json: "maximumWeightSizeKiloBytes", js: "maximumWeightSizeKiloBytes", typ: 0 },
        { json: "compressPercentage", js: "compressPercentage", typ: 0 },
        { json: "supportedExtensions", js: "supportedExtensions", typ: a("") },
        { json: "enable", js: "enable", typ: true },
    ], false),
    "PaginationConfiguration": o([
        { json: "Account", js: "Account", typ: r("AccountClass") },
        { json: "Card", js: "Card", typ: r("AccountClass") },
        { json: "Credit", js: "Credit", typ: r("AccountClass") },
    ], false),
    "AccountClass": o([
        { json: "minimunConsultationDate", js: "minimunConsultationDate", typ: Date },
        { json: "maximunConsultationDays", js: "maximunConsultationDays", typ: 0 },
        { json: "initialDefaultDate", js: "initialDefaultDate", typ: Date },
    ], false),
    "QueryFilterMilisecondsTimeConfiguration": o([
        { json: "QUERY_FILTER_TIME_NOTIFICATION", js: "QUERY_FILTER_TIME_NOTIFICATION", typ: 0 },
        { json: "QUERY_FILTER_SERVICES_REGISTERED", js: "QUERY_FILTER_SERVICES_REGISTERED", typ: 0 },
    ], false),
    "TypeTransactionMap": o([
        { json: "National", js: "National", typ: a("") },
    ], false),
    "Contract": o([
    ], false),
    "ConversionCatalogues": o([
        { json: "IdentificationType", js: "IdentificationType", typ: r("IdentificationType") },
        { json: "AccountType", js: "AccountType", typ: r("ConversionCataloguesAccountType") },
        { json: "BrandCardType", js: "BrandCardType", typ: m("") },
        { json: "BankBrandCreditCardType", js: "BankBrandCreditCardType", typ: m("") },
        { json: "EmploymentRelationshipType", js: "EmploymentRelationshipType", typ: m("") },
        { json: "HousingType", js: "HousingType", typ: m("") },
        { json: "LevelEducationType", js: "LevelEducationType", typ: m("") },
        { json: "DependentEconomicActivityType", js: "DependentEconomicActivityType", typ: m("") },
        { json: "BankBrandDebitCardType", js: "BankBrandDebitCardType", typ: r("BankBrandDebitCardType") },
        { json: "GoalsForScheduledSavings", js: "GoalsForScheduledSavings", typ: r("GoalsForScheduledSavings") },
    ], false),
    "ConversionCataloguesAccountType": o([
        { json: "A", js: "A", typ: "" },
        { json: "C", js: "C", typ: "" },
        { json: "T", js: "T", typ: "" },
    ], false),
    "GoalsForScheduledSavings": o([
        { json: "0005", js: "0005", typ: "" },
    ], false),
    "FeaturedActions": o([
        { json: "2", js: "2", typ: "" },
    ], false),
    "GetContractBalanceResponse": o([
        { json: "maxAmount", js: "maxAmount", typ: 0 },
        { json: "minAmount", js: "minAmount", typ: 0 },
        { json: "accounts", js: "accounts", typ: a(r("AccountElement")) },
        { json: "deposits", js: "deposits", typ: a("any") },
        { json: "loans", js: "loans", typ: a("any") },
        { json: "cards", js: "cards", typ: a("any") },
        { json: "userMessage", js: "userMessage", typ: "" },
    ], false),
    "AccountElement": o([
        { json: "accountId", js: "accountId", typ: 0 },
        { json: "accountIdentifier", js: "accountIdentifier", typ: "" },
        { json: "accountNumber", js: "accountNumber", typ: "" },
        { json: "allowDownloadStatements", js: "allowDownloadStatements", typ: true },
        { json: "accountTypeCode", js: "accountTypeCode", typ: r("DocumentType") },
        { json: "accountType", js: "accountType", typ: "" },
        { json: "accountTypeLabel", js: "accountTypeLabel", typ: "" },
        { json: "accountOwnerName", js: "accountOwnerName", typ: "" },
        { json: "accountAliasName", js: "accountAliasName", typ: "" },
        { json: "relationTypeCode", js: "relationTypeCode", typ: "" },
        { json: "isFavorite", js: "isFavorite", typ: true },
        { json: "balances", js: "balances", typ: a(r("Balance")) },
        { json: "transactionType", js: "transactionType", typ: "" },
        { json: "allowAdditionalCard", js: "allowAdditionalCard", typ: true },
        { json: "allowNewCard", js: "allowNewCard", typ: true },
        { json: "allowBalanceDebit", js: "allowBalanceDebit", typ: true },
        { json: "allowBalanceCredit", js: "allowBalanceCredit", typ: true },
        { json: "institutionCode", js: "institutionCode", typ: "" },
        { json: "institutionName", js: "institutionName", typ: "" },
        { json: "beneficiaryTypeCode", js: "beneficiaryTypeCode", typ: r("BeneficiaryTypeCode") },
        { json: "typeTransactionConfigurations", js: "typeTransactionConfigurations", typ: a(r("TypeTransactionConfiguration")) },
        { json: "scheduledSaving", js: "scheduledSaving", typ: a(r("ScheduledSaving")) },
        { json: "predefinedAmounts", js: "predefinedAmounts", typ: r("PredefinedAmounts") },
    ], false),
    "Balance": o([
        { json: "balanceType", js: "balanceType", typ: "" },
        { json: "amount", js: "amount", typ: 3.14 },
        { json: "currency", js: "currency", typ: "" },
    ], false),
    "PredefinedAmounts": o([
        { json: "$ 10", js: "$ 10", typ: 0 },
        { json: "$ 20", js: "$ 20", typ: 0 },
        { json: "$ 30", js: "$ 30", typ: 0 },
        { json: "$ 100", js: "$ 100", typ: 0 },
    ], false),
    "ScheduledSaving": o([
        { json: "scheduledSavingId", js: "scheduledSavingId", typ: 0 },
        { json: "amount", js: "amount", typ: 0 },
    ], false),
    "TypeTransactionConfiguration": o([
        { json: "transactionType", js: "transactionType", typ: "" },
        { json: "maxAmountByTransaction", js: "maxAmountByTransaction", typ: 3.14 },
        { json: "maxAmountByTransactionAllowed", js: "maxAmountByTransactionAllowed", typ: 0 },
        { json: "maxAmountDaily", js: "maxAmountDaily", typ: 0 },
        { json: "maxAmountDailyAllowed", js: "maxAmountDailyAllowed", typ: 0 },
        { json: "minAmountByTransation", js: "minAmountByTransation", typ: 0 },
    ], false),
    "GetFrequentPaymentResponse": o([
        { json: "userMessage", js: "userMessage", typ: "" },
        { json: "genericBeneficiaries", js: "genericBeneficiaries", typ: a(r("GenericBeneficiary")) },
    ], false),
    "GenericBeneficiary": o([
        { json: "serviceDescription", js: "serviceDescription", typ: "" },
        { json: "nickName", js: "nickName", typ: "" },
        { json: "sequential", js: "sequential", typ: 0 },
        { json: "beneficiaryTransaction", js: "beneficiaryTransaction", typ: u(undefined, r("BeneficiaryTransaction")) },
        { json: "iconCode", js: "iconCode", typ: u(undefined, "") },
        { json: "beneficiaryService", js: "beneficiaryService", typ: u(undefined, r("BeneficiaryService")) },
    ], false),
    "BeneficiaryService": o([
        { json: "serviceId", js: "serviceId", typ: 0 },
        { json: "nickname", js: "nickname", typ: "" },
        { json: "requiredEditFields", js: "requiredEditFields", typ: a(r("RequiredEditField")) },
        { json: "serviceIdentifier", js: "serviceIdentifier", typ: "" },
        { json: "businessSelectionLabel", js: "businessSelectionLabel", typ: "" },
        { json: "serviceTypeCode", js: "serviceTypeCode", typ: "" },
        { json: "serviceTypeDescription", js: "serviceTypeDescription", typ: "" },
        { json: "serviceTypeIcon", js: "serviceTypeIcon", typ: "" },
        { json: "serviceCode", js: "serviceCode", typ: "" },
        { json: "serviceDescription", js: "serviceDescription", typ: "" },
        { json: "serviceIcon", js: "serviceIcon", typ: "" },
        { json: "businessDescription", js: "businessDescription", typ: "" },
        { json: "methodPaymentflow", js: "methodPaymentflow", typ: "" },
        { json: "debitProductTaxes", js: "debitProductTaxes", typ: r("DebitProductTaxes") },
        { json: "isNewService", js: "isNewService", typ: true },
        { json: "isRegistrationRequired", js: "isRegistrationRequired", typ: true },
        { json: "showPaymentLabelsInPaymetPage", js: "showPaymentLabelsInPaymetPage", typ: true },
    ], false),
    "DebitProductTaxes": o([
        { json: "Accounts", js: "Accounts", typ: r("Accounts") },
        { json: "CreditCards", js: "CreditCards", typ: r("Accounts") },
    ], false),
    "Accounts": o([
        { json: "Tarifa", js: "Tarifa", typ: 3.14 },
    ], false),
    "RequiredEditField": o([
        { json: "value", js: "value", typ: "" },
        { json: "visualResumen", js: "visualResumen", typ: true },
        { json: "isEditable", js: "isEditable", typ: true },
        { json: "parameter", js: "parameter", typ: "" },
        { json: "displayInStep", js: "displayInStep", typ: "" },
        { json: "label", js: "label", typ: "" },
        { json: "showInRegister", js: "showInRegister", typ: true },
        { json: "showInEdit", js: "showInEdit", typ: true },
        { json: "isItemAmountField", js: "isItemAmountField", typ: true },
        { json: "type", js: "type", typ: "" },
        { json: "regex", js: "regex", typ: "" },
        { json: "values", js: "values", typ: a("any") },
        { json: "showConditions", js: "showConditions", typ: a("any") },
        { json: "enableConditions", js: "enableConditions", typ: a("any") },
        { json: "requiredConditions", js: "requiredConditions", typ: a("any") },
    ], false),
    "BeneficiaryTransaction": o([
        { json: "beneficiaryId", js: "beneficiaryId", typ: 0 },
        { json: "beneficiaryIdentifier", js: "beneficiaryIdentifier", typ: "" },
        { json: "beneficiaryIdentifierType", js: "beneficiaryIdentifierType", typ: r("BeneficiaryIdentifierType") },
        { json: "beneficiaryTypeCode", js: "beneficiaryTypeCode", typ: r("BeneficiaryTypeCode") },
        { json: "beneficiaryName", js: "beneficiaryName", typ: "" },
        { json: "beneficiaryContractNumber", js: "beneficiaryContractNumber", typ: "" },
        { json: "beneficiaryInstitutionCode", js: "beneficiaryInstitutionCode", typ: "" },
        { json: "beneficiaryInstitutionName", js: "beneficiaryInstitutionName", typ: "" },
        { json: "beneficiaryAlias", js: "beneficiaryAlias", typ: "" },
        { json: "accountType", js: "accountType", typ: r("DocumentType") },
        { json: "isFavorite", js: "isFavorite", typ: true },
        { json: "sequential", js: "sequential", typ: 0 },
        { json: "creditCardType", js: "creditCardType", typ: u(undefined, "") },
        { json: "transactionType", js: "transactionType", typ: r("TransactionType") },
        { json: "email", js: "email", typ: u(undefined, "") },
    ], false),
    "InfoUser": o([
        { json: "fullName", js: "fullName", typ: "" },
        { json: "urlProfileImage", js: "urlProfileImage", typ: "" },
        { json: "userAlias", js: "userAlias", typ: "" },
        { json: "documentType", js: "documentType", typ: r("DocumentType") },
        { json: "documentNumber", js: "documentNumber", typ: "" },
        { json: "phoneNumber", js: "phoneNumber", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "username", js: "username", typ: "" },
        { json: "lastSession", js: "lastSession", typ: Date },
    ], false),
    "InputControlValidations": o([
        { json: "QrNotificationPhoneNumber", js: "QrNotificationPhoneNumber", typ: r("QrNotificationPhoneNumber") },
    ], false),
    "QrNotificationPhoneNumber": o([
        { json: "validations", js: "validations", typ: r("Validations") },
        { json: "restrictions", js: "restrictions", typ: a("") },
    ], false),
    "Validations": o([
        { json: "^09", js: "^09", typ: "" },
        { json: "^\\d{10}$", js: "^\\d{10}$", typ: "" },
    ], false),
    "PromotionsComponent": o([
        { json: "backGround", js: "backGround", typ: r("BackGround") },
        { json: "title", js: "title", typ: r("Description") },
        { json: "description", js: "description", typ: r("Description") },
        { json: "border", js: "border", typ: r("Border") },
        { json: "button", js: "button", typ: r("Button") },
    ], false),
    "BackGround": o([
        { json: "url", js: "url", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "Border": o([
        { json: "whiteHexadecimalColor", js: "whiteHexadecimalColor", typ: u(undefined, r("HexadecimalColor")) },
        { json: "blackHexadecimalColor", js: "blackHexadecimalColor", typ: u(undefined, r("HexadecimalColor")) },
    ], false),
    "Button": o([
        { json: "backGround", js: "backGround", typ: r("Border") },
        { json: "color", js: "color", typ: r("Border") },
    ], false),
    "Description": o([
        { json: "color", js: "color", typ: r("Contract") },
        { json: "text", js: "text", typ: "" },
    ], false),
    "SecurityMethodsByAction": [
        "BankTotp",
        "Otp",
        "Question",
    ],
    "DocumentType": [
        "A",
        "C",
        "T",
    ],
    "BeneficiaryTypeCode": [
        "CreditCards",
        "OtherBankAccount",
        "OwnerBankAccount",
    ],
    "BeneficiaryIdentifierType": [
        "C",
        "R",
    ],
    "TransactionType": [
        "Interbank",
        "OtherOwnerBankAccount",
    ],
    "HexadecimalColor": [
        "#000000",
        "#0d6efd",
        "#560b0b",
    ],
};
