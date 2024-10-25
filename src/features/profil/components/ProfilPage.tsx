import React, { memo } from 'react'
import * as metatags from '@/config/metatags'
import Head from 'expo-router/head'
import { pageConfigs } from '../configs'
import PageLayout from './Layout'
import PageHeader from './PageHeader'

type PageProps = {
  screenName: string
  children: React.ReactNode
  backArrow?: boolean
}

const ProfilPage = (props: PageProps) => {
  const config = pageConfigs[props.screenName]!
  return (
    <>
      <Head>
        <title>{metatags.createTitle(config.title)}</title>
      </Head>
      <PageLayout>
        <>
          {/* <PageHeader {...config} backArrow={props.backArrow} /> */}
          {props.children}
        </>
      </PageLayout>
    </>
  )
}

export default memo(ProfilPage)
