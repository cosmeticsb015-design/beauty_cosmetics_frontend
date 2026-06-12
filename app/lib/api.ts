
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL no está configurada"
  );
}

const baseUrl = API_URL.replace(/\/$/, "");

export type StrapiRequestOptions = Omit<
  RequestInit,
  "method" | "body"
> & {
  token?: string;
};

async function request<T>(
  endpoint: string,
  method: string,
  data?: unknown,
  options: StrapiRequestOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);

  const isFormData = data instanceof FormData;

  if (!isFormData) {
    requestHeaders.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${baseUrl}/api/${endpoint}`,
    {
      method,
      headers: requestHeaders,
      ...rest,
      body:
        data === undefined
          ? undefined
          : isFormData
            ? data
            : JSON.stringify(data),
    }
  );

  if (!response.ok) {
    let message = response.statusText;

    try {
      const error = await response.json();

      message =
        error?.error?.message ??
        error?.message ??
        message;
    } catch { }

    throw new Error(
      `Strapi ${method} ${endpoint}: ${message}`
    );
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null as T;
  }

  return response.json();
}

export const strapi = {
  get: <T>(
    endpoint: string,
    options?: StrapiRequestOptions
  ) =>
    request<T>(
      endpoint,
      "GET",
      undefined,
      options
    ),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: StrapiRequestOptions
  ) =>
    request<T>(
      endpoint,
      "POST",
      data,
      options
    ),

  put: <T>(
    endpoint: string,
    data?: unknown,
    options?: StrapiRequestOptions
  ) =>
    request<T>(
      endpoint,
      "PUT",
      data,
      options
    ),

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options?: StrapiRequestOptions
  ) =>
    request<T>(
      endpoint,
      "PATCH",
      data,
      options
    ),

  delete: <T>(
    endpoint: string,
    options?: StrapiRequestOptions
  ) =>
    request<T>(
      endpoint,
      "DELETE",
      undefined,
      options
    ),

  upload: <T>(
    formData: FormData,
    options?: StrapiRequestOptions
  ) =>
    request<T>(
      "upload",
      "POST",
      formData,
      options
    ),
};