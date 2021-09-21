import __syncMemberType from './sync-member-type'
import errors from '@twreporter/errors'

function wrapErrorReporting(hook: Function) {
  return async (listName: string, hookName: string, ...args) => {
    try {
      return await hook(...args)
    } catch(err) {
      const annotatingError = errors.helpers.wrap(
        err,
        'ListHookError',
        `Error occurs in \`${listName}.hooks.${hookName}\``,
        { ...args }
      )

      console.error(JSON.stringify({
        severity: 'ERROR',
        // All exceptions that include a stack trace will be
        // integrated with Error Reporting.
        // See https://cloud.google.com/run/docs/error-reporting
        message: errors.helpers.printAll(annotatingError, {
          withStack: true,
          withPayload: true,
        }),
      }))
    }

  }
}

export default {
  syncMemberType: wrapErrorReporting(__syncMemberType),
}
