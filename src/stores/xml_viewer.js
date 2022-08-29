import { defineStore } from "pinia";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { useHistoryStore } from "./history";

export const useXMLViewerStore = defineStore("xml_viewer", {
  state: () => ({
    parsedFile: [],
    historyStore: useHistoryStore(),
  }),
  getters: {
    GET_TEXT_FILE: (state) => state.textFile,
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
      console.log("remove_node", index, idxEl);
      this.parsedFile[index].nodes.splice(idxEl, 1);
    },

    SET_TEXT_FILE(data) {
      this.textFile = data.toString();
    },

    SET_FILE(data) {
      const fr = new FileReader();
      fr.onloadend = async (end) => {
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
    CREATE_NODES(data) {
      let node = [];
      data.Package.types.forEach((element) => {
        node.push({
          members: JSON.stringify(element.members),
          name: JSON.stringify(element.name),
        });
      });
      return node;
    },
  },
});
