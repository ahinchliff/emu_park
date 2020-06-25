import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";

export interface ApiClientBaseOptions {
  apiBaseURL: string;
  onError(error: AxiosError, url: string, errorHandled?: boolean): void;
  responseDataMapper<T>(res: AxiosResponse<any>): T;
}

export class ApiClientBase<
  Options extends ApiClientBaseOptions = ApiClientBaseOptions
> {
  private apiClient: AxiosInstance;

  constructor(protected options: Options) {
    this.apiClient = Axios.create({
      baseURL: options.apiBaseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosRetry(this.apiClient, this.retryConfig());
  }

  public setAuthorization = (authToken: string): void => {
    this.apiClient = Axios.create({
      baseURL: this.options.apiBaseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      responseType: "json",
    });

    axiosRetry(this.apiClient, this.retryConfig());
  };

  public clearAuthorization = (): void => {
    this.apiClient = Axios.create({
      baseURL: this.options.apiBaseURL,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });

    axiosRetry(this.apiClient, this.retryConfig());
  };

  protected get = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.apiClient
      .get(url, axiosReqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) => this.options.onError(err, url)) as Promise<T>;

  protected post = <T>(
    url: string,
    data?: object,
    reqConfig?: AxiosRequestConfig,
    errorHandled?: boolean
  ): Promise<T> =>
    this.apiClient
      .post(url, data, reqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) =>
        this.options.onError(err, url, errorHandled)
      ) as Promise<T>;

  protected put = <T>(
    url: string,
    data?: any,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.apiClient
      .put(url, data, axiosReqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) => this.options.onError(err, url)) as Promise<T>;

  protected delete = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.apiClient
      .delete(url, axiosReqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) => this.options.onError(err, url)) as Promise<T>;

  private exponentialDelay = (...ars: any[]) => {
    const retryNumber = ars.length > 0 && ars[0] !== undefined ? ars[0] : 0;

    const delay = Math.pow(2, retryNumber) * 100;
    const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
    const retryIn = delay + randomSum;
    return retryIn;
  };

  private retryConfig = () => {
    const isSafeToRetry = (error: any): boolean => {
      if (!error.config) {
        return false;
      }

      const IDEMPOTENT_HTTP_METHODS = [
        "get",
        "head",
        "options",
        "put",
        "delete",
      ];
      return IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
    };
    return {
      retries: 8,
      retryDelay: this.exponentialDelay,
      retryCondition: (error: any) => {
        const shouldRetry =
          isSafeToRetry(error) &&
          (isNetworkOrIdempotentRequestError(error) ||
            error.code === "ECONNABORTED");
        if (shouldRetry) {
          console.log("failed http request, retrying..");
        }
        return shouldRetry;
      },
    };
  };
}
