import {
  Pool,
  PoolConnection,
  RowDataPacket,
  FieldPacket,
  format,
  OkPacket,
  // tslint:disable-next-line:no-submodule-imports
} from "mysql2/promise";
import { lt, select, SelectStatement, Statement } from "sql-bricks";

export interface IMySQLTransaction extends data.IDBTransaction {
  connection: PoolConnection;
}

export default class MySQLClientBase {
  constructor(
    private pool: Pool,
    private logger: core.Logger,
    private logValues: boolean = false
  ) {}

  protected async beginTransaction(): Promise<IMySQLTransaction> {
    const connection = await this.pool.getConnection();
    await connection.query("START TRANSACTION");
    return {
      connection,
      end: (): Promise<void> => this.endTransaction(connection),
    };
  }

  protected async endTransaction(connection: PoolConnection): Promise<void> {
    await connection.query("COMMIT");
    connection.release();
  }

  protected async query(
    statement: Statement,
    dbTransaction?: IMySQLTransaction,
    limit?: number
  ): Promise<[RowDataPacket[], FieldPacket[]]> {
    const connOrPool = dbTransaction ? dbTransaction.connection : this.pool;

    const sql = statement.toParams();
    const sqlText = limit ? `${sql.text} LIMIT 0,${limit}` : sql.text;

    this.logFormattedSQL(sqlText, sql.values);

    return connOrPool.query<RowDataPacket[]>(sqlText, sql.values);
  }

  protected async mutate(
    statement: Statement,
    dbTransaction?: IMySQLTransaction
  ): Promise<OkPacket> {
    const connOrPool = dbTransaction ? dbTransaction.connection : this.pool;

    const sql = statement.toParams();

    this.logFormattedSQL(sql.text, sql.values);

    const [resultSet] = await connOrPool.query<OkPacket>(sql.text, sql.values);
    return resultSet;
  }

  protected async searchInternal<T>(
    itemProjection: SelectStatement,
    fromConstructor: (sql: SelectStatement) => SelectStatement,
    mapToDataModel: (row: RowDataPacket) => T,
    page: number = 1,
    pageSize: number = 20,
    countProjection?: SelectStatement,
    dbTransaction?: IMySQLTransaction,
    usesGroupBy?: boolean
  ): Promise<data.ISearchResults<T>> {
    const pageNum = Number(page) || 1;
    let pageSizeNum = Number(pageSize);
    if (!pageSizeNum || pageSizeNum > 50) {
      pageSizeNum = 50;
    }
    const from: number = (pageNum - 1) * pageSizeNum;

    const itemSql = fromConstructor(itemProjection).toParams();
    const countSql = fromConstructor(
      countProjection || select("COUNT(*) as count")
    ).toParams();

    const itemSqlWithPaging = `${itemSql.text} LIMIT ${from},${pageSizeNum}`;

    this.logFormattedSQL(itemSqlWithPaging, itemSql.values);
    this.logFormattedSQL(countSql.text, countSql.values);

    const connOrPool = dbTransaction ? dbTransaction.connection : this.pool;

    const itemResult = connOrPool.query<RowDataPacket[]>(
      itemSqlWithPaging,
      itemSql.values
    );
    const countResult = connOrPool.query<RowDataPacket[]>(
      countSql.text,
      countSql.values
    );

    const [items] = await itemResult;
    const [totalCount] = await countResult;

    return {
      totalCount:
        (usesGroupBy
          ? totalCount.length
          : totalCount[0] && totalCount[0].count) || 0,
      items: items.map(mapToDataModel),
    };
  }

  protected async searchInternalFromId<T>(
    itemProjection: SelectStatement,
    fromConstructor: (sql: SelectStatement) => SelectStatement,
    mapToDataModel: (row: RowDataPacket) => T,
    lastIdKey: string,
    lastId: number,
    pageSize: number = 20,
    countProjection?: SelectStatement,
    dbTransaction?: IMySQLTransaction
  ): Promise<data.ISearchResultsFromId<T>> {
    let pageSizeNum = Number(pageSize);
    if (!pageSizeNum || pageSizeNum > 50) {
      pageSizeNum = 50;
    }

    const lessThan = (i: SelectStatement) =>
      lastId && lastId > 0 ? i.where(lt(lastIdKey, lastId)) : i;

    const getParams = (i: SelectStatement) => fromConstructor(i).toParams();

    const itemSql = getParams(lessThan(itemProjection));
    const countSql = getParams(countProjection || select("COUNT(*) as count"));

    const itemSqlWithPaging = `${itemSql.text} LIMIT 0,${pageSizeNum + 1}`;

    this.logFormattedSQL(itemSqlWithPaging, itemSql.values);
    this.logFormattedSQL(countSql.text, countSql.values);

    const connOrPool = dbTransaction ? dbTransaction.connection : this.pool;

    const itemResult = connOrPool.query<RowDataPacket[]>(
      itemSqlWithPaging,
      itemSql.values
    );
    const countResult = connOrPool.query<RowDataPacket[]>(
      countSql.text,
      countSql.values
    );

    const [items] = await itemResult;
    const [totalCount] = await countResult;

    return {
      totalCount: totalCount[0].count,
      items: items.slice(0, pageSizeNum).map(mapToDataModel),
      finalPage: pageSizeNum >= items.length,
    };
  }

  private logFormattedSQL = async (
    _sqlString: string,
    _values: any
  ): Promise<void> => {
    if (this.logValues) {
      this.logger.debug("executing sql", { sql: format(_sqlString, _values) });
    } else {
      this.logger.debug("executing sql", { sql: _sqlString });
    }
  };
}
