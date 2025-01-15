/// <reference types="node" />
/* eslint-env node */
/* global fetch, process */
/* eslint-disable no-console */

const payload = {
  sender: 'github-actions',
  event: process.env.WORKFLOW_JOB,
  type: process.env.EAS_WORKFLOW_TYPE,
  branch: process.env.BRANCH_NAME,
  domain: process.env.EXPO_PUBLIC_ASSOCIATED_DOMAIN,
  last_commit_message: process.env.LAST_COMMIT_MESSAGE,
  comment: `${process.env.PLATFORM} ${process.env.EAS_WORKFLOW_COMMENT_INPUT ? ' -> ' + process.env.EAS_WORKFLOW_COMMENT_INPUT : ''}`,
  env: process.env.WORKFLOW_ENVIRONMENT,
  github_workflow_url: process.env.WORKFLOW_URL,
}

const requestOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
}

fetch(process.env.MAKE_WEBHOOK_URL, requestOptions)
