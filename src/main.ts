import * as core from '@actions/core'
import * as github from '@actions/github'
import {getLatestGoodDeploymentRef} from './getLatestGoodDeploymentRef'

async function run(): Promise<void> {
  try {
    const inputs = {
      environment: core.getInput('environment', {required: true}),
      token: core.getInput('token', {required: true})
    }

    const ref = await getLatestGoodDeploymentRef({
      ...inputs,
      repoName: github.context.repo.repo,
      repoOwner: github.context.repo.owner
    })

    core.setOutput('ref', ref)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
