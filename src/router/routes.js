const routes = [
  {
    path: "/",
    name: "XMLViewer",
    component: () => import("pages/XMLViewer.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
