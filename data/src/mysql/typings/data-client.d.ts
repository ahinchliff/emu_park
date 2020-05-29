declare namespace data {
  interface DataClients {
    user: data.UserClient;
    dbTransaction: data.IDBTransactionClient;
  }
}
