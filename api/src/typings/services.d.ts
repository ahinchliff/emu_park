declare namespace api {
  type Services = {
    data: data.DataClients;
    auth: core.backend.IAuthService;
    // file: core.backend.IFileService;
    // socket: core.backend.ISocketService;
  };
}
