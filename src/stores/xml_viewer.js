import { defineStore } from "pinia";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { useHistoryStore } from "./history";

export const useXMLViewerStore = defineStore("xml_viewer", {
  state: () => ({
    parsedFile: [],
    historyStore: useHistoryStore(),


    dialogMerge: false,

    selectedXML: [],

  }),
  getters: {
    GET_TEXT_FILE: (state) => state.textFile,

    GET_SELECTED_XML: (state) => state.selectedXML,

    GET_DIALOG_MERGE_HIDE: (state) => state.dialogMerge

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
      console.log("remove_node", index, idxEl);
      this.parsedFile[index].nodes.splice(idxEl, 1);
    },

    SET_TEXT_FILE(data)
    {
      this.textFile = data.toString();
    },

    SET_FILE(data)
    {
      const fr = new FileReader();
      fr.onloadend = async (end) =>
      {

        console.log(end.target.result);

        let parser = new XMLParser({
          alwaysCreateTextNode: true,
          ignoreAttributes: false,
          ignoreDeclaration: false,
          parseAttributeValue: true,
          commentPropName: "#comment",
        });

        let pf = {
          uuid: crypto.randomUUID(),
          closing: false,
          checked: false,
          openInfo: false,
          hover: false,
          index: this.parsedFile.length + 1,
          nameFile: data.name,
          pathFile: data.path,
          text: end.target.result,
          parsed: parser.parse(end.target.result),
        };

        pf.nodes = this.CREATE_NODES(parser.parse(end.target.result));

        this.parsedFile.push(pf);

        this.historyStore.ADD_TO_HISTORY({
          action: "add",
          name: pf.nameFile,
          path: pf.pathFile,
          uuid: pf.uuid,
        });
        /*   const builder = new XMLBuilder();
        const xmlContent = builder.build(this.XMLViewerStore.parsedFile);
        console.dir(xmlContent); */
      };
      fr.readAsText(data);
    },

    CREATE_NODES(data)
    {
      let node = [];
      let members = [];


      data.Package.types.forEach((element) =>
      {

        console.log('memb', element.members)
        if (Object.values(element.members).length > 1)
        {
          Object.values(element.members).forEach(m =>
          {
            members.push(m);

          });
        } else
        {
          members.push(element.members)
        }


        node.push({
          members: JSON.stringify(members),
          name: JSON.stringify(element.name),
        });
        members = []
      });
      return node;
    },

    DELETE_XML(data)
    {
      this.parsedFile.forEach((el, index) =>
      {
        if (el.uuid === data)
        {
          this.parsedFile.splice(index, 1);
          this.historyStore.history.splice(index, 1);
        }


      })
    },

    GET_CHECKED_XML()
    {
      console.log('CHECKED CHECK')
      this.parsedFile.forEach((el, ind) =>
      {
        if (this.selectedXML.includes(el.uuid))
        {
          if (!el.checked)
          {
            this.selectedXML.splice(ind, 1);
          }
        } else
        {
          if (el.checked)
          {
            this.selectedXML.push(el.uuid)
          }
        }
      });

    }
  },
});
