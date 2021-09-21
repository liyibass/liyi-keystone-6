import axios from 'axios'
import errors from '@twreporter/errors'

const apiURL = process.env.API_URL_FOR_SYNC_MEMBER || 'http://localhost:8080'

interface Opts {
  memberIds: string[];
  retryAttempts?: number;
  retryInterval?: number;
}

interface OptsWithAttempt extends Opts {
  attempt: number;
}

async function __syncMemberTypeRecursively({
  memberIds,
  retryAttempts,
  retryInterval,
  attempt=0,
}: OptsWithAttempt) {

  // API doc: 
  // https://github.com/mirror-media/subscription-webhooks/blob/main/packages/publishers/docs/sync-member-type.yaml
  const url = apiURL + '/internal/sync-member-type'

  try {
    const apiRes = await axios.post(url, {
      memberIds,
    })

    return apiRes.data
  } catch (axiosErr) {
    if (attempt > retryAttempts) {
      let annotatingError = errors.helpers.annotateAxiosError(axiosErr)
      annotatingError = errors.helpers.wrap(
        annotatingError,
        'SyncMemberTypeError',
        'Error to send request to API server for syncing member type',
        { memberIds },
      )
      throw annotatingError
    }

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const _res = await __syncMemberTypeRecursively({
            memberIds,
            retryAttempts,
            retryInterval,
            attempt: attempt + 1,
          })
          resolve(_res)
        } catch (err) {
          reject(err)
        }
      }, retryInterval)
    })
  }
}

export default async function syncMemberType({
  memberIds,
  retryAttempts=3,
  retryInterval=3000, //ms
}: Opts) {

  return await __syncMemberTypeRecursively({
    memberIds,
    retryAttempts,
    retryInterval,
    attempt: 1,
  })
}
