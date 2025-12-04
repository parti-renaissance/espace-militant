import React, { memo } from 'react'
import * as metatags from '@/config/metatags'
import Head from 'expo-router/head'
import { pageConfigs } from '../configs'
import PageLayout from './Layout'
import { Header } from '@/components/AppStructure'

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
      <PageLayout>{props.children}</PageLayout>
    </>
  )
}

export default memo(ProfilPage)
