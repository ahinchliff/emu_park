declare namespace api {
  type Services = {
    data: data.DataClients;
    auth: core.IAuthService;
    file: core.IFileService;
    socket: core.ISocketService;
  };
}
