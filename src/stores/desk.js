import { defineStore } from "pinia";
import { XMLParser } from "fast-xml-parser";
import { useXMLViewerStore } from "./xml_viewer";

export const useDeskStore = defineStore("desk", {
  state: () => ({
    parsedFile: [],


  }),
  actions: {

    SET_FILE(data, color)
    {
      console.log('DESK : DATA FROM FILE', data);
      const fr = new FileReader();
      fr.onloadend = async (end) =>
      {
        this._CREATE_XML({ data: data, end: end, color: color });
      };

      fr.readAsText(data);
      console.log('DESK : FILE');

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
        side: data.color,
        index: this.parsedFile.length + 1,
        nameFile: data.data.name,
        pathFile: data.data.path,
        text: data.end.target.result,
        parsed: parser.parse(data.end.target.result),
      };

      // pf.nodes = this.CREATE_NODES(parser.parse(end.target.result));
      if (!pf.text.includes('<Profile') ||
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
    },


  },
  getters: {

  }
});
