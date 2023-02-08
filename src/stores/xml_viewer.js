import { defineStore } from "pinia";
import { XMLParser } from "fast-xml-parser";
import { useHistoryStore } from "./history";

export const useXMLViewerStore = defineStore("xml_viewer", {
  state: () => ({
    parsedFile: [],
    historyStore: useHistoryStore(),


    dialogMerge: false,

    dialogModifyType: false,

    nodeOnModify: {},

    selectedXML: [],

  }),
  getters: {
    GET_TEXT_FILE: (state) => state.textFile,

    GET_SELECTED_XML: (state) => state.selectedXML,

    GET_DIALOG_MERGE_HIDE: (state) => state.dialogMerge,

    GET_DIALOG_MODIFY_TYPE_HIDE: (state) => state.dialogModifyType

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
      const fr = new FileReader();
      fr.onloadend = async (end) =>
      {

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
              case 'members': return true;
              default: return false;
            }
          }
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

        // pf.nodes = this.CREATE_NODES(parser.parse(end.target.result));

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

    /*    CREATE_NODES(data)
       {
         let node = [];
         let members = [];


         data.Package.types.forEach((element) =>
         {
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
       }, */

    DELETE_XML(data)
    {
      this.parsedFile.forEach((el, index) =>
      {
        if (el.uuid === data)
        {
          this.parsedFile.splice(index, 1);
          this.historyStore.history.splice(index, 1);
        }
      });

      this.selectedXML = this.selectedXML.filter(xml => xml != data);
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

    },

    ADD_TYPE_ON_XML(data)
    {
      this.parsedFile[data.index].parsed["Package"]["types"].push({
        members: [],
        name: { '#text': data.name }
      })
    },

    SET_TYPE_ON_MODIFY(data)
    {
      console.log(data.node)
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
        if (a['#text'] < b['#text'])
        {
          return -1
        }
        if (a['#text'] > b['#text'])
        {
          return 1
        }
        return 0
      });
    },

    SORT_TYPES_AND_MEMBERS(data)
    {
      this.parsedFile[data.indexParsedFile].parsed["Package"]["types"].sort((a, b) =>
      {
        let aa = a.name, bb = b.name;
        if (aa['#text'] < bb['#text'])
        {
          return -1
        }
        if (aa['#text'] > bb['#text'])
        {
          return 1
        }
        return 0
      });

      this.parsedFile[data.indexParsedFile].parsed["Package"]["types"].forEach((n) =>
      {
        let mem = n.members;

        mem.sort((a, b) =>
        {
          if (a['#text'] < b['#text'])
          {
            return -1
          }
          if (a['#text'] > b['#text'])
          {
            return 1
          }
          return 0
        });
        n.members = mem;
      });

    },

    UPDATE_PARSED_TYPES(data)
    {


    }
  },
});
