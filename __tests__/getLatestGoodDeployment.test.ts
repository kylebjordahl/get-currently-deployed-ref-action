import {it, expect} from '@jest/globals'

import {getLatestGoodDeploymentRef} from '../src/getLatestGoodDeploymentRef'

it.skip('live test', async () => {
  const result = await getLatestGoodDeploymentRef({
    repoName: '',
    repoOwner: '',
    environment: '',
    token: 'TOKEN HERE'
  })

  expect(result).not.toBeUndefined()
})
