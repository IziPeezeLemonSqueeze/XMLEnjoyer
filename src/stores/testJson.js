import { defineStore } from "pinia";
import { useXMLViewerStore } from "./xml_viewer";

export const useTestJson = defineStore("test_json", {
  state: () => ({

    XMLViewerStore: useXMLViewerStore(),

    statusApexClasses: false,

    apexClassFounded: [],

    bodyJson: "",

  }),
  actions: {

    INIT_JSON()
    {

      const validClasses = this.apexClassFounded.filter(aClass => !aClass['#text'].toLowerCase().includes('test'));

      console.log('VALID CLASS', validClasses);

      let classToStringOnly = [];

      validClasses.forEach(c =>
      {
        classToStringOnly.push(c['#text']);
      });

      this.bodyJson = '{\n"key1": "';

      const classGoodForJson = [];

      this.XMLViewerStore.metadataRetrieved.forEach(mdt =>
      {
        classToStringOnly.forEach(cstring =>
        {
          if (mdt.includes(cstring + '_Test') || mdt.includes(cstring + 'Test'))
          {
            classGoodForJson.push(mdt);
          }
        });

      });

      console.log(classGoodForJson);
      if (classGoodForJson.length > 0)
      {

        classGoodForJson.forEach(c =>
        {
          this.bodyJson = this.bodyJson.concat(c).concat(',');
        });
        this.bodyJson = this.bodyJson.substring(0, this.bodyJson.length - 1);
        this.bodyJson += '"\n}';
      } else
      {
        this.bodyJson = 'ERRORE, IN QUESTA ORG NON HO TROVATO QUESTE CLASSI';
      }
    }

  },
  getters: {

  }
});
