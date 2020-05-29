declare namespace data {
  interface EntityClientBase<T, K> {
    create(data: K, t?: data.IDBTransaction): Promise<T>;
    createMany(data: K[], t?: data.IDBTransaction): Promise<number>;
    delete(
      where: Partial<T>,
      t?: data.IDBTransaction,
    ): Promise<{ success: boolean }>;
    update(
      where: Partial<T>,
      data: Partial<T>,
      t?: data.IDBTransaction,
    ): Promise<T>;
    get(where: Partial<T>, t?: data.IDBTransaction): Promise<T | undefined>;
    getMany(where: Partial<T>, t?: data.IDBTransaction): Promise<T[]>;
  }
}
