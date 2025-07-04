import { defineStore } from "pinia";
import { XMLParser } from "fast-xml-parser";
import { useHistoryStore } from "./history";
import { useAppStore } from "./app";
import { Notify, QSpinnerGrid } from "quasar";

export const useXMLViewerStore = defineStore("xml_viewer", {
  state: () => ({
    parsedFile: [],
    historyStore: useHistoryStore(),
    appStore: useAppStore(),

    metadataList: [
      "AccountRelationshipShareRule",
      "AccountSettings",
      "ActionLinkGroupTemplate",
      "ActionPlanTemplate",
      "ActivitiesSettings",
      "AddressSettings",
      "AnalyticsSettings",
      "AnimationRule",
      "ApexClass",
      "ApexComponent",
      "ApexEmailNotifications",
      "ApexPage",
      "ApexSettings",
      "ApexTestSuite",
      "ApexTrigger",
      "AppMenu",
      "AppointmentSchedulingPolicy",
      "ApprovalProcess",
      "ArticleType",
      "AssistantSettings",
      "AssignmentRules",
      "Audience",
      "AuthProvider",
      "AuraDefinitionBundle",
      "AutoResponseRule",
      "AutoResponseRules",
      "BlacklistedConsumer",
      "Bot",
      "BotSettings",
      "BrandingSet",
      "BusinessHoursSettings",
      "BusinessProcess",
      "CMSConnectSource",
      "CallCenter",
      "CallCenterRoutingMap",
      "CampaignInfluenceModel",
      "CampaignSettings",
      "CaseSettings",
      "Certificate",
      "ChannelLayout",
      "ChatterAnswersSettings",
      "ChatterEmailsMDSettings",
      "ChatterExtension",
      "ChatterSettings",
      "CleanDataService",
      "CodeSettings",
      "Community",
      "CommunityTemplateDefinition",
      "CommunityThemeDefinition",
      "CompanySettings",
      "CompactLayout",
      "ConnectedApp",
      "ConnectedAppSettings",
      "ContentAsset",
      "ContractSettings",
      "ConversationChannelDefinition",
      "ConversationVendorFieldDef",
      "CorsWhitelistOrigin",
      "CrmAnalyticsSettings",
      "CspTrustedSite",
      "CurrencySettings",
      "CustomAddressFieldSettings",
      "CustomApplication",
      "CustomApplicationComponent",
      "CustomFeedFilter",
      "CustomField",
      "CustomHelpMenuSection",
      "CustomIndex",
      "CustomLabels",
      "CustomMetadata",
      "CustomObject",
      "CustomObjectTranslation",
      "CustomPageWebLink",
      "CustomPermission",
      "CustomSite",
      "CustomTab",
      "CustomValue",
      "DataCategoryGroup",
      "DataWeaveResource",
      "DefaultShortcut",
      "DelegateGroup",
      "DevHubSettings",
      "DigitalExperience",
      "DigitalExperienceBundle",
      "DigitalExperienceConfig",
      "Document",
      "DocumentCategory",
      "DocumentCategoryDocumentType",
      "DocumentType",
      "EclairGeoData",
      "EinsteinAgentConfig",
      "EinsteinAssistantConfig",
      "EinsteinFeatureConfig",
      "EinsteinGPTConfig",
      "EmailAdministrationSettings",
      "EmailDeliverabilitySettings",
      "EmailIntegrationSettings",
      "EmailServicesFunction",
      "EmailTemplate",
      "EmbeddedServiceBranding",
      "EmbeddedServiceConfig",
      "EmbeddedServiceFlowConfig",
      "EmbeddedServiceLiveAgent",
      "EmbeddedServiceMenuSettings",
      "EntitlementProcess",
      "EntitlementSettings",
      "EntitlementTemplate",
      "EscalationRule",
      "EscalationRules",
      "EssentialsSettings",
      "EventDelivery",
      "EventSubscription",
      "ExperienceBundle",
      "ExperiencePropertyTypeBundle",
      "ExternalDataSource",
      "ExternalServiceRegistration",
      "ExternalString",
      "FeatureParameterBoolean",
      "FeatureParameterDate",
      "FeatureParameterInteger",
      "FieldServiceSettings",
      "FieldSet",
      "FinancialServicesSettings",
      "FlexiPage",
      "Flow",
      "FlowCategory",
      "FlowDefinition",
      "ForecastingSettings",
      "GlobalValueSet",
      "GlobalValueSetTranslation",
      "GoogleAppsSettings",
      "Group",
      "HealthCloudSettings",
      "HighVelocitySalesSettings",
      "HomePageComponent",
      "HomePageLayout",
      "IdeasSettings",
      "IndustrySettings",
      "InstalledPackage",
      "KeywordList",
      "KnowledgeSettings",
      "Layout",
      "LeadConvertSettings",
      "LightningBolt",
      "LightningComponentBundle",
      "LightningExperienceTheme",
      "LightningMessageChannel",
      "LightningOnboardingConfig",
      "ListView",
      "LiveAgentSettings",
      "LiveChatAgentConfig",
      "LiveChatButton",
      "LiveChatDeployment",
      "LiveChatSensitiveDataRule",
      "LiveChatSettings",
      "MacroSettings",
      "ManagedContentSpace",
      "ManagedContentType",
      "ManagedTopics",
      "MarketingActionSettings",
      "MatchingRules",
      "MessagingChannel",
      "MilestoneType",
      "MlDomain",
      "MobileApplicationDetail",
      "MobileSettings",
      "ModerationRule",
      "MuleSoftConnector",
      "MyDomainDiscoverableLogin",
      "NamedCredential",
      "NavigationMenu",
      "Network",
      "NetworkBranding",
      "OauthCustomScope",
      "OpportunitySettings",
      "OrderSettings",
      "OrgWideEmailAddress",
      "PartyDataModelSettings",
      "PathAssistant",
      "PaymentGatewayProvider",
      "PermissionSet",
      "PersonAccount",
      "PlatformCachePartition",
      "PlatformEventChannel",
      "PlatformEventChannelMember",
      "PlatformEventSubscriberConfig",
      "Portal",
      "PostTemplate",
      "PresenceDeclineReason",
      "PresenceUserConfig",
      "PredictionBuilderSettings",
      "PrivacySettings",
      "ProductSettings",
      "Profile",
      "ProfilePasswordPolicy",
      "ProfileSessionSetting",
      "Prompt",
      "Queue",
      "QueueRoutingConfig",
      "QuickAction",
      "QuoteSettings",
      "RecommendationStrategy",
      "RecordActionDeployment",
      "RecordType",
      "RedirectWhitelistUrl",
      "Report",
      "ReportFolder",
      "ReportType",
      "Role",
      "SamlSsoConfig",
      "Scontrol",
      "SearchSettings",
      "SecuritySettings",
      "ServiceChannel",
      "ServiceCloudVoiceSettings",
      "ServicePresenceStatus",
      "ServiceSetupAssistantSettings",
      "Settings",
      "SharingCriteriaRule",
      "SharingOwnerRule",
      "SharingReason",
      "SharingRules",
      "SharingSet",
      "SharingSettings",
      "SiteDotCom",
      "Skill",
      "SocialCustomerServiceSettings",
      "StandardValueSetTranslation",
      "StaticResource",
      "SurveySettings",
      "SynonymDictionary",
      "TableauHostMapping",
      "Territory",
      "Territory2",
      "Territory2Model",
      "Territory2Rule",
      "Territory2Type",
      "TerritorySettings",
      "TimeSheetTemplate",
      "TopicsForObjects",
      "TrailheadSettings",
      "TransactionSecurityPolicy",
      "Translations",
      "UserManagementSettings",
      "ValidationRule",
      "VoiceSettings",
      "WarrantyLifecycleMgmtSettings",
      "WaveApplication",
      "WaveAsset",
      "WaveDashboard",
      "WaveDataflow",
      "WaveDataset",
      "WaveLens",
      "WaveRecipe",
      "WaveTemplateBundle",
      "WaveXmd",
      "WorkDotComSettings",
      "WorkSkillRouting",
      "Workflow",
      "WorkflowAlert",
      "WorkflowFieldUpdate",
      "WorkflowKnowledgePublish",
      "WorkflowOutboundMessage",
      "WorkflowRule",
      "WorkflowSend",
      "WorkflowTask",
    ],

    dialogMerge: false,

    dialogJsonTest: false,

    dialogModifyType: false,

    nodeOnModify: {},

    selectedXML: [],
    $q: null,
    Notify: null,

    downloadingMDT: false,

    lastMetadataRetrievied: null,
    metadataRetrieved: [],

    notifyDismissDownloadMDT: null,
  }),
  getters: {
    GET_TEXT_FILE: (state) => state.textFile,

    GET_SELECTED_XML: (state) => state.selectedXML,

    GET_DIALOG_MERGE_HIDE: (state) => state.dialogMerge,

    GET_DIALOG_MODIFY_TYPE_HIDE: (state) => state.dialogModifyType,

    GET_DIALOG_TEST_JSON_HIDE: (state) => state.dialogJsonTest,

    GET_NOTIFY_DISMISS_DOWNLOAD_MDT: (state) => state.notifyDismissDownloadMDT,
  },
  actions: {
    SET_HOVER(data) {
      console.log("xml_hover", data);

      let el = this.parsedFile.filter((elem) => {
        if (elem.uuid == data.i) {
          elem.hover = data.b;
          return elem;
        }
      });

      console.log(el);
    },

    REMOVE_NODE(index, idxEl) {
      this.parsedFile[index].parsed["Package"]["types"].splice(idxEl, 1);
    },

    SET_TEXT_FILE(data) {
      this.textFile = data.toString();
    },

    GENERATE_NEW_EMPTY_XML() {
      this.parsedFile.push({
        uuid: crypto.randomUUID(),
        closing: false,
        checked: false,
        openInfo: false,
        hover: false,
        index: this.parsedFile.length + 1,
        nameFile: crypto.randomUUID(),
        pathFile: null,
        text: null,
        parsed: {
          "?xml": {
            "@_version": "1.0",
            "@_encoding": "UTF-8",
            "@_standalone": "yes",
          },
          Package: {
            types: [{ members: [], name: { "#text": "CHANGE_ME" } }],
            version: { "#text": this.appStore.apiVersion },
            "@_xmlns": "http://soap.sforce.com/2006/04/metadata",
          },
          "#comment": { "#text": "" },
        },
      });
    },

    SET_FILE(data) {
      console.log("DATA FROM FILE", data);
      const fr = new FileReader();

      if (data.includes("<?xml")) {
        this._CREATE_XML({
          data: {
            name: "FROM_CLIPBOARD" + crypto.randomUUID(),
            path: null,
          },
          end: { target: { result: data } },
        });
      } else if (data[0].type === "text/xml") {
        fr.readAsText(data[0]);
        console.log("FILE READ");
        fr.onload = async () => {
          console.log("END", fr.result);
          this._CREATE_XML({
            data: data,
            end: { target: { result: fr.result } },
          });
        };
      }
    },

    _CREATE_XML(data, fromClip) {
      console.log("CREATE XML", data);
      let parser = new XMLParser({
        alwaysCreateTextNode: true,
        ignoreAttributes: false,
        ignoreDeclaration: false,
        parseAttributeValue: false,
        commentPropName: "#comment",
        isArray: (name, jpath, isLeafNode, isAttribute) => {
          //console.log(name, jpath, isLeafNode, isAttribute)
          switch (name) {
            case "members":
              return true;
            case "types":
              return true;
            default:
              return false;
          }
        },
      });

      let pf = {
        uuid: crypto.randomUUID(),
        closing: false,
        checked: false,
        openInfo: false,
        hover: false,
        index: this.parsedFile.length + 1,
        nameFile: data.data.name,
        pathFile: data.data.path,
        text: data.end.target.result,
        parsed: parser.parse(data.end.target.result),
      };

      // CHECK TYPES COMMENTED THEN DELETE
      if (pf.parsed["Package"]["#comment"]) {
        delete pf.parsed["Package"]["#comment"];
      }

      // pf.nodes = this.CREATE_NODES(parser.parse(end.target.result));
      if (
        !pf.text.includes("<Package") ||
        !pf.text.includes("soap.sforce.com")
      ) {
        this.Notify.create({
          message: "XML NON VALIDO!",
          color: "red",
          timeout: 3000,
        });
        return;
      }
      this.parsedFile.push(pf);

      this.historyStore.ADD_TO_HISTORY({
        action: "add",
        name: pf.nameFile,
        path: pf.pathFile,
        uuid: pf.uuid,
      });
    },

    DELETE_XML(data) {
      this.parsedFile.forEach((el, index) => {
        if (el.uuid === data) {
          this.parsedFile.splice(index, 1);
        }
      });

      this.historyStore.history = this.historyStore.history.filter(
        (xml) => xml.uuid != data
      );
      this.selectedXML = this.selectedXML.filter((xml) => xml != data);
    },

    GET_CHECKED_XML() {
      this.parsedFile.forEach((el, ind) => {
        if (el.checked) {
          !this.selectedXML.includes(el.uuid)
            ? this.selectedXML.push(el.uuid)
            : null;
        } else {
          this.selectedXML.includes(el.uuid)
            ? this.selectedXML.splice(this.selectedXML.indexOf(el.uuid), 1)
            : null;
        }
      });
    },

    ADD_TYPE_ON_XML(data) {
      this.parsedFile[data.index].parsed["Package"]["types"].unshift({
        members: [],
        name: { "#text": data.name },
      });
      this.Notify.create({
        message:
          "Aggiunto un nuovo TYPES a XML: " + this.parsedFile[data.index].index,
        color: "green",
        timeout: 3000,
      });
      this.ADD_COMMENT_LASTMODIFIED_ON_XML(data.index);
    },

    SET_TYPE_ON_MODIFY(data) {
      console.log(data);
      this.nodeOnModify.indexSelected = data.parsedFileIndex;
      this.nodeOnModify.indexNodeSelected = data.parsedFileNodeIndex;
      this.nodeOnModify.members = data.node.members;
      this.nodeOnModify.name = data.node.name;
    },

    DELETE_TYPE_FROM_ONMODIFY(data) {
      this.nodeOnModify.members.splice(data, 1);
    },

    ADD_TYPE_FROM_ONMODIFY() {
      this.nodeOnModify.members.unshift({ "#text": "" });
    },

    SORT_TYPES_FROM_ONMODIFY() {
      this.nodeOnModify.members.sort((a, b) => {
        if (a["#text"] < b["#text"]) {
          return -1;
        }
        if (a["#text"] > b["#text"]) {
          return 1;
        }
        return 0;
      });
    },

    SORT_TYPES_AND_MEMBERS(data) {
      this.parsedFile[data.indexParsedFile].parsed["Package"]["types"].sort(
        (a, b) => {
          let aa = a.name,
            bb = b.name;
          if (aa["#text"] < bb["#text"]) {
            return -1;
          }
          if (aa["#text"] > bb["#text"]) {
            return 1;
          }
          return 0;
        }
      );

      this.parsedFile[data.indexParsedFile].parsed["Package"]["types"].forEach(
        (n) => {
          let mem = n.members;

          mem.sort((a, b) => {
            if (a["#text"] < b["#text"]) {
              return -1;
            }
            if (a["#text"] > b["#text"]) {
              return 1;
            }
            return 0;
          });
          n.members = mem;
        }
      );
      this.ADD_COMMENT_LASTMODIFIED_ON_XML(data.indexParsedFile);
    },

    SET_METADATA_RETRIEVED(data) {
      this.metadataRetrieved = [];
      let ret = JSON.parse(data);

      ret.result.forEach((mdt) => {
        if (mdt.fullName.includes("%28")) {
          mdt.fullName = mdt.fullName.replace("%28", "(");
        }
        if (mdt.fullName.includes("%29")) {
          mdt.fullName = mdt.fullName.replace("%29", ")");
        }
        if (mdt.fullName.includes("%26")) {
          mdt.fullName = mdt.fullName.replace("%26", "&");
        }

        //console.log(mdt.type, mdt.manageableState, mdt.namespacePrefix)
        if (mdt.type == "Layout" && mdt.manageableState == "installed") {
          mdt.fullName = mdt.fullName.replace(
            "-",
            "-" + mdt.namespacePrefix + "__"
          );
        }

        this.metadataRetrieved.push(mdt.fullName);
      });
      this.metadataRetrieved.sort();
    },

    ADD_COMMENT_LASTMODIFIED_ON_XML(data) {
      console.log(data, "ADD LAST MODIFIED", this.appStore.nameOperator);
      const nowDate = new Date();
      this.parsedFile[data].parsed["#comment"] = {
        "#text":
          this.appStore.nameOperator +
          " " +
          (nowDate.getDate() < 10
            ? "0" + nowDate.getDate()
            : nowDate.getDate()) +
          "/" +
          (nowDate.getMonth() + 1 < 10
            ? "0" + (nowDate.getMonth() + 1)
            : nowDate.getMonth() + 1) +
          "/" +
          nowDate.getFullYear(),
      };
    },

    CREATE_NOTIFY_DOWNLOAD_FROM_ORG_MDT(data) {
      this.downloadingMDT = true;
      this.notifyDismissDownloadMDT = this.Notify.create({
        message: `Scarico Metadata dalla ORG ${data}`,
        color: "blue",
        timeout: 0,
        position: "bottom",
        textColor: "white",
        spinner: QSpinnerGrid,
      });
    },
  },
});
