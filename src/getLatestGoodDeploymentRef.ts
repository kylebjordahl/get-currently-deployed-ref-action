/* eslint-disable filenames/match-regex */
import * as core from '@actions/core'
import * as github from '@actions/github'

export interface LatestGoodDeploymentRef {
  ref: string | undefined
  sha: string | undefined
}

export async function getLatestGoodDeploymentRef(args: {
  token: string
  environment: string
  repoOwner: string
  repoName: string
}): Promise<LatestGoodDeploymentRef | undefined> {
  const octo = github.getOctokit(args.token)

  const {repository} = await octo.graphql(`
    { 
      repository(owner:"${args.repoOwner}" name:"${args.repoName}") {
        deployments(
          environments:["${args.environment}"]
          first: 50
          # add end cursor here with after:
          orderBy: {
            field:CREATED_AT
            direction:DESC
          }
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          
          nodes{
            environment
            commitOid
            ref {
              id
              name
            }
            latestStatus {
              state
            }
          }
        }
      }
    }
    `)

  const deploy = repository?.deployments?.nodes?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any) => d?.latestStatus?.state === 'SUCCESS'
  )

  if (deploy) {
    core.info(
      `found last successful deployment \n${JSON.stringify(
        deploy,
        undefined,
        2
      )}`
    )
  }

  return {
    ref: deploy?.ref?.name ?? undefined,
    sha: deploy?.ref?.commitOid ?? undefined
  }
}
