import { defineStore } from "pinia";
import { XMLParser } from "fast-xml-parser";
import { useHistoryStore } from "./history";
import { useAppStore } from "./app";
import { Notify } from "quasar";

export const useXMLViewerStore = defineStore("xml_viewer", {
  state: () => ({
    parsedFile: [],
    historyStore: useHistoryStore(),
    appStore: useAppStore(),

    metadataList: [
      "AccountRelationshipShareRule",
      "ActionLinkGroupTemplate",
      "ApexClass",
      "ApexComponent",
      "ApexPage",
      "ApexTrigger",
      "AppMenu",
      "ApprovalProcess",
      "ArticleType",
      "AssignmentRules",
      "Audience",
      "AuthProvider",
      "AuraDefinitionBundle",
      "AutoResponseRules",
      "Bot",
      "BrandingSet",
      "CallCenter",
      "Certificate",
      "CleanDataService",
      "CMSConnectSource",
      "Community",
      "CommunityTemplateDefinition",
      "CommunityThemeDefinition",
      "CompactLayout",
      "ConnectedApp",
      "ContentAsset",
      "CorsWhitelistOrigin",
      "CustomApplication",
      "CustomApplicationComponent",
      "CustomFeedFilter",
      "CustomField",
      "CustomHelpMenuSection",
      "CustomMetadata",
      "CustomLabels",
      "CustomObjectTranslation",
      "CustomObject",
      "CustomPageWebLink",
      "CustomPermission",
      "CustomSite",
      "CustomTab",
      "DataCategoryGroup",
      "DelegateGroup",
      "DuplicateRule",
      "EclairGeoData",
      "EntitlementProcess",
      "EntitlementTemplate",
      "EventDelivery",
      "EventSubscription",
      "ExternalServiceRegistration",
      "ExternalDataSource",
      "FeatureParameterBoolean",
      "FeatureParameterDate",
      "FeatureParameterInteger",
      "FieldSet",
      "FlexiPage",
      "Flow",
      "FlowCategory",
      "FlowDefinition",
      "GlobalValueSet",
      "GlobalValueSetTranslation",
      "Group",
      "HomePageComponent",
      "HomePageLayout",
      "InstalledPackage",
      "KeywordList",
      "Layout",
      "LightningBolt",
      "LightningComponentBundle",
      "LightningExperienceTheme",
      "LiveChatAgentConfig",
      "LiveChatButton",
      "LiveChatDeployment",
      "LiveChatSensitiveDataRule",
      "ManagedTopics",
      "MatchingRules",
      "MilestoneType",
      "MlDomain",
      "ModerationRule",
      "NamedCredential",
      "Network",
      "NetworkBranding",
      "PathAssistant",
      "PermissionSet",
      "PlatformCachePartition",
      "Portal",
      "PostTemplate",
      "PresenceDeclineReason",
      "PresenceUserConfig",
      "Profile",
      "ProfilePasswordPolicy",
      "ProfileSessionSetting",
      "Queue",
      "QueueRoutingConfig",
      "QuickAction",
      "RecommendationStrategy",
      "RecordActionDeployment",
      "ReportType",
      "Role",
      "SamlSsoConfig",
      "Scontrol",
      "ServiceChannel",
      "ServicePresenceStatus",
      "SharingRules",
      "SharingSet",
      "SiteDotCom",
      "Skill",
      "StandardValueSetTranslation",
      "StaticResource",
      "SynonymDictionary",
      "Territory",
      "Territory2",
      "Territory2Model",
      "Territory2Rule",
      "Territory2Type",
      "TopicsForObjects",
      "TransactionSecurityPolicy",
      "Translations",
      "WaveApplication",
      "WaveDashboard",
      "WaveDataflow",
      "WaveDataset",
      "WaveLens",
      "WaveTemplateBundle",
      "WaveXmd",
      "Workflow",
      "ActionPlanTemplate",
      "AnimationRule",
      "ChannelLayout",
      "ApexTestSuite",
      "AppointmentSchedulingPolicy",
      "CampaignInfluenceModel",
      "ChatterExtension",
      "CspTrustedSite",
      "CompactLayout",
      "ExperienceBundle",
      "LightningMessageChannel",
      "MyDomainDiscoverableLogin",
      "NavigationMenu",
      "OauthCustomScope",
      "PaymentGatewayProvider",
      "PlatformEventChannel",
      "PlatformEventChannelMember",
      "Prompt",
      "RedirectWhitelistUrl",
      "Settings",
      "TimeSheetTemplate",
      "WaveRecipe",
      "WorkSkillRouting",
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


  }),
  getters: {
    GET_TEXT_FILE: (state) => state.textFile,

    GET_SELECTED_XML: (state) => state.selectedXML,

    GET_DIALOG_MERGE_HIDE: (state) => state.dialogMerge,

    GET_DIALOG_MODIFY_TYPE_HIDE: (state) => state.dialogModifyType,

    GET_DIALOG_TEST_JSON_HIDE: (state) => state.dialogJsonTest,
  },
  actions: {
    SET_HOVER(data)
    {
      console.log("xml_hover", data);

      let el = this.parsedFile.filter((elem) =>
      {
        if (elem.uuid == data.i)
        {
          elem.hover = data.b;
          return elem;
        }
      });

      console.log(el);
    },

    REMOVE_NODE(index, idxEl)
    {
      this.parsedFile[index].parsed["Package"]["types"].splice(idxEl, 1);
    },

    SET_TEXT_FILE(data)
    {
      this.textFile = data.toString();
    },

    SET_FILE(data)
    {
      console.log('DATA FROM FILE', data);
      const fr = new FileReader();
      fr.onloadend = async (end) =>
      {
        this._CREATE_XML({ data: data, end: end });
      };

      if (!data.name)
      {
        if (!data.includes('<Package') ||
          !data.includes('xmlns="http://soap.sforce.com'))
        {
          this.Notify.create({
            message:
              "XML NON VALIDO!",
            color: "red",
            timeout: 3000,
          });
          return;
        }
        this._CREATE_XML({
          data:
          {
            name: 'FROM_CLIPBOARD' + crypto.randomUUID(),
            path: null
          },
          end: { target: { result: data } }
        });
      } else
      {
        fr.readAsText(data);
        console.log('FILE');
      }
    },

    _CREATE_XML(data)
    {
      console.log(data);
      let parser = new XMLParser({
        alwaysCreateTextNode: true,
        ignoreAttributes: false,
        ignoreDeclaration: false,
        parseAttributeValue: false,
        commentPropName: "#comment",
        isArray: (name, jpath, isLeafNode, isAttribute) =>
        {
          //console.log(name, jpath, isLeafNode, isAttribute)
          switch (name)
          {
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

      // pf.nodes = this.CREATE_NODES(parser.parse(end.target.result));
      if (!pf.text.includes('<Package') ||
        !pf.text.includes('soap.sforce.com'))
      {
        this.Notify.create({
          message:
            "XML NON VALIDO!",
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

    DELETE_XML(data)
    {
      this.parsedFile.forEach((el, index) =>
      {
        if (el.uuid === data)
        {
          this.parsedFile.splice(index, 1);
        }
      });

      this.historyStore.history = this.historyStore.history.filter((xml) => xml.uuid != data)
      this.selectedXML = this.selectedXML.filter((xml) => xml != data);
    },

    GET_CHECKED_XML()
    {
      this.parsedFile.forEach((el, ind) =>
      {
        if (el.checked)
        {
          !this.selectedXML.includes(el.uuid) ? this.selectedXML.push(el.uuid) : null;
        } else
        {
          this.selectedXML.includes(el.uuid) ? this.selectedXML.splice(this.selectedXML.indexOf(el.uuid), 1) : null;
        }
      });
    },

    ADD_TYPE_ON_XML(data)
    {
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

    SET_TYPE_ON_MODIFY(data)
    {
      console.log(data);
      this.nodeOnModify.indexSelected = data.parsedFileIndex;
      this.nodeOnModify.indexNodeSelected = data.parsedFileNodeIndex;
      this.nodeOnModify.members = data.node.members;
      this.nodeOnModify.name = data.node.name;
    },

    DELETE_TYPE_FROM_ONMODIFY(data)
    {
      this.nodeOnModify.members.splice(data, 1);
    },

    ADD_TYPE_FROM_ONMODIFY()
    {
      this.nodeOnModify.members.push({ "#text": "" });
    },

    SORT_TYPES_FROM_ONMODIFY()
    {
      this.nodeOnModify.members.sort((a, b) =>
      {
        if (a["#text"] < b["#text"])
        {
          return -1;
        }
        if (a["#text"] > b["#text"])
        {
          return 1;
        }
        return 0;
      });
    },

    SORT_TYPES_AND_MEMBERS(data)
    {
      this.parsedFile[data.indexParsedFile].parsed["Package"]["types"].sort(
        (a, b) =>
        {
          let aa = a.name,
            bb = b.name;
          if (aa["#text"] < bb["#text"])
          {
            return -1;
          }
          if (aa["#text"] > bb["#text"])
          {
            return 1;
          }
          return 0;
        }
      );

      this.parsedFile[data.indexParsedFile].parsed["Package"]["types"].forEach(
        (n) =>
        {
          let mem = n.members;

          mem.sort((a, b) =>
          {
            if (a["#text"] < b["#text"])
            {
              return -1;
            }
            if (a["#text"] > b["#text"])
            {
              return 1;
            }
            return 0;
          });
          n.members = mem;
        }
      );
      this.ADD_COMMENT_LASTMODIFIED_ON_XML(data.indexParsedFile);
    },

    SET_METADATA_RETRIEVED(data)
    {
      this.metadataRetrieved = [];
      let ret = JSON.parse(data);

      ret.result.forEach((mdt) =>
      {

        if (mdt.fullName.includes('%28'))
        {
          mdt.fullName = mdt.fullName.replace('%28', '(');
        }
        if (mdt.fullName.includes('%29'))
        {
          mdt.fullName = mdt.fullName.replace('%29', ')');
        }
        if (mdt.fullName.includes('%26'))
        {
          mdt.fullName = mdt.fullName.replace('%26', '&');
        }

        //console.log(mdt.type, mdt.manageableState, mdt.namespacePrefix)
        if (mdt.type == 'Layout' && mdt.manageableState == 'installed')
        {
          mdt.fullName = mdt.fullName.replace('-', '-' + mdt.namespacePrefix + '__');
        }

        this.metadataRetrieved.push(mdt.fullName);
      });
    },

    ADD_COMMENT_LASTMODIFIED_ON_XML(data)
    {
      const nowDate = new Date();
      this.parsedFile[data].parsed['#comment'] = {
        '#text': this.appStore.nameOperator +
          " " +
          nowDate.getDate() +
          "/" +
          (nowDate.getMonth() + 1 < 10
            ? "0" + (nowDate.getMonth() + 1)
            : nowDate.getMonth() + 1) +
          "/" +
          nowDate.getFullYear(),
      };
    }
  },
});
