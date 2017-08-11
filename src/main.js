export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    // Loading the aurelia-interactjs plugin adds interact-* custom attributes 
    // to the application. In this application we use dropzone and draggable. 
    // See app.html.
    .plugin('aurelia-interactjs');

  aurelia.start().then(() => aurelia.setRoot());
}
