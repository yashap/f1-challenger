import { ChallengerClient } from '@f1-challenger/challenger-client'
import { QueryKey, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ChallengerClientBuilder } from 'src/apiClient/ChallengerClientBuilder'

/**
 * Execute a query using the ChallengerClient.
 *
 * @param options - The options for the query
 * @param options.queryKey - The TanStack Query query key (see https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
 * @param options.queryFn - The function to execute, using the ChallengerClient
 * @returns The query result
 */
export const useChallengerClient = <T>({
  queryKey,
  queryFn,
}: {
  queryKey: QueryKey
  queryFn: (client: ChallengerClient) => Promise<T>
}): UseQueryResult<T> => {
  const client = useMemo(() => ChallengerClientBuilder.build(), [])
  return useQuery({
    queryKey: [...queryKey, client],
    queryFn: () => queryFn(client),
  })
}
