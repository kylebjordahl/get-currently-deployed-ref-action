/* eslint-disable filenames/match-regex */
import * as github from '@actions/github'

export async function getLatestGoodDeploymentRef(args: {
  token: string
  environment: string
  repoOwner: string
  repoName: string
}): Promise<string | undefined> {
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

  return deploy.ref.name ?? undefined
}
