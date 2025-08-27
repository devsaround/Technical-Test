'use client';

import { useCallback } from 'react';

type TMutationRequestHandler<RequestPayloadType, ResponseType> = (
  payload: RequestPayloadType,
  onSuccess: (response: ResponseType | null) => void,
  onError: (errorMessage: string) => void
) => void;

export function useGetMutationRequestHandler<
  RequestBodyType,
  RequestResponseType,
>(
  endpoint: string,
  requestMethod: 'POST' | 'DELETE',
  onInitRequest: () => void,
  onCompleteRequest: () => void
): [TMutationRequestHandler<RequestBodyType, RequestResponseType>] {
  const handler: TMutationRequestHandler<RequestBodyType, RequestResponseType> =
    useCallback(
      (payload, onSuccess, onError) => {
        onInitRequest();
        fetch(endpoint, {
          method: requestMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Status: ${response.status}. Message: ${response.statusText}`
              );
            }
            const hasBody =
              response.headers.get('content-type') === 'application/json';
            if (!hasBody) {
              return null;
            }
            return response.json() as Promise<RequestResponseType>;
          })
          .then((data) => {
            onSuccess(data);
          })
          .catch((requestError) => {
            let errorMessage = `Unknown error: ${requestError}`;
            if (requestError instanceof Error) {
              errorMessage = requestError.message;
            }
            onError(errorMessage);
          })
          .finally(() => {
            onCompleteRequest();
          });
      },
      [endpoint, onCompleteRequest, onInitRequest, requestMethod]
    );

  return [handler];
}
