import { defineStore } from "pinia";
import { useXMLViewerStore } from "./xml_viewer";

import { XMLValidator, XMLBuilder } from "fast-xml-parser";

export const useMergeToolStore = defineStore("merge_tool", {
  state: () => ({

    XMLViewerStore: useXMLViewerStore(),

    validationXml: false,
    reorderOnFinalXml: false,
    progress: false,

    labelProgress: '',

    merging: false,



  }),
  actions: {
    START_MERGING()
    {
      this.merging = true;
      this.labelProgress = 'MERGING';
      this.progress = true;

      let xmls = this.XMLViewerStore.parsedFile.filter((pf) => pf.checked);
      let merged = xmls.shift();
      const finalXml = JSON.parse(JSON.stringify(merged));
      let mergedTypes = finalXml.parsed.Package.types;

      xmls.forEach((xml) =>
      {
        let types = xml.parsed.Package.types;

        mergedTypes.forEach((mt, idx) =>
        {
          types.forEach(xmlt =>
          {
            if (mt.name['#text'] == xmlt.name['#text'])
            {
              console.log('MT', mt.name, 'XML', xmlt.name);

              let diff =
                xmlt.members.filter(t =>
                  !mt.members.some(tt =>
                    t['#text'] === tt['#text']
                  )
                );
              diff.forEach(d =>
              {
                mergedTypes[idx].members.push(d);
              })
            }


            let found = false;
            mergedTypes.forEach(mtName =>
            {
              if (mtName.name['#text'] == xmlt.name['#text'])
              {
                found = true;
              }
            });

            if (!found)
            {
              mergedTypes.push(xmlt);
            }
          })
        });


      });

      finalXml.index = 'MERGED';
      finalXml.uuid = crypto.randomUUID();
      finalXml.pathFile = "";
      finalXml.checked = true;
      finalXml.text = "";
      finalXml.nameFile = 'package.xml'
      this.XMLViewerStore.parsedFile.forEach(pf =>
      {
        pf.checked = false;
        this.XMLViewerStore.selectedXML = [];
      });

      this.XMLViewerStore.parsedFile.push(finalXml)
      this.XMLViewerStore.selectedXML.push(finalXml.uuid)
      this.labelProgress = 'COMPLETE';

    },

    EXPORT_XML()
    {
      const builder = new XMLBuilder({
        format: true,
        ignoreAttributes: false,
      });


      return builder.build(
        this.XMLViewerStore.parsedFile.filter((pf) => pf.checked)[0].parsed/* .Package.types  */
      )


    },


    _VALIDATION_XML()
    {
      let lastResult = null;
      state.XMLViewerStore.parsedFile.filter((pf) =>
      {
        if (pf.checked)
        {
          lastResult = XMLValidator.validate()
        }
      })
    }

  },
  getters: {
    GET_VALIDATION_XML: (state) => state.validationXml,
    GET_REORDER_FINAL_XML: (state) => state.reorderOnFinalXml,
    GET_PROGRESS_BAR_STATUS: (state) => state.progress,
    GET_LABEL_PROGRESS_BAR_STATUS: (state) => state.labelProgress,

    GET_MERGING_IN_PROGRESS: (state) => state.merging,
  }
});
