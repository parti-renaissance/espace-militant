import { ComponentRef, forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb'
import { usePageLayoutScroll } from '@/components/layouts/PageLayout/usePageLayoutScroll'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { items } from '@/screens/formations/bread-crumbs-items'
import { FormationScreenProps } from '@/screens/formations/types'
import { useGetFormations } from '@/services/formations/hook'
import * as types from '@/services/formations/schema'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { getTokenValue, ScrollView, YStack } from 'tamagui'
import { FormationDenyCard } from '../components/DenyCard'
import FormationDesktopLayout from './ FormationDesktopLayout'
import FormationSection, { FormationSectionSkeleton } from './FormationSection'

type ScrollViewProps = {
  onSectionChange: (section: 'local' | 'national') => void
  data: types.RestGetFormationsResponse
}

type ScrollViewRefs = {
  scrollRef: ComponentRef<typeof ScrollView> | HTMLDivElement | null
  nationalLayout: LayoutRectangle | null
  localLayout: LayoutRectangle | null
  isWebPageLayoutScrollActive: boolean
}

const FormationDesktopScrollViewAllow = forwardRef<ScrollViewRefs, ScrollViewProps>(({ data, ...props }, ref) => {
  const scrollViewContainerStyle = useMemo(
    () => ({
      pt: 166,
      pl: '$medium',
      pr: '$medium',
      paddingBottom: getTokenValue('$xxlarge', 'space') + 166,
    }),
    [],
  )
  const formationsNational = data.filter((formation) => formation.visibility === 'national')
  const formationsLocal = data.filter((formation) => formation.visibility === 'local')
  const firstSection = formationsLocal.length > 0 ? 'local' : 'national'

  const nationalLayout = useRef<LayoutRectangle | null>(null)
  const localLayout = useRef<LayoutRectangle | null>(null)
  const scrollRef = useRef<ComponentRef<typeof ScrollView> | null>(null)

  const isScrolling = useRef(false)

  const handleLayout =
    (filter: 'national' | 'local') =>
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      if (typeof layout.y !== 'number') return
      if (filter === 'national') {
        nationalLayout.current = layout
      }
      if (filter === 'local') {
        localLayout.current = layout
      }
    }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let timeout: NodeJS.Timeout | null = null
    if (timeout) {
      clearTimeout(timeout)
    }
    isScrolling.current = true
    timeout = setTimeout(() => {
      isScrolling.current = false
    }, 500)
    if (scrollRef?.current) {
      if (nationalLayout.current && localLayout.current) {
        const nationalL = nationalLayout.current
        const localL = localLayout.current
        const secondSectionL = firstSection === 'local' ? nationalL : localL
        const contentOffsetY = e.nativeEvent.contentOffset.y
        const scrollViewYCenter = e.nativeEvent.layoutMeasurement.height / 2

        if (secondSectionL.y - contentOffsetY < scrollViewYCenter) {
          props.onSectionChange(firstSection === 'local' ? 'national' : 'local')
        } else {
          props.onSectionChange(firstSection)
        }
      }
    }
  }

  const { isWebPageLayoutScrollActive, layoutRef } = usePageLayoutScroll({
    onScroll: handleScroll,
    scrollEventThrottle: 32,
    ref: scrollRef,
  })

  useImperativeHandle(ref, () => {
    return {
      scrollRef: isWebPageLayoutScrollActive ? (layoutRef?.current ?? null) : scrollRef.current,
      nationalLayout: nationalLayout.current,
      localLayout: localLayout.current,
      isWebPageLayoutScrollActive,
    }
  })

  return (
    <ScrollView
      ref={!isWebPageLayoutScrollActive ? scrollRef : undefined}
      scrollEnabled={!isWebPageLayoutScrollActive}
      scrollEventThrottle={32}
      onScroll={handleScroll}
      flex={1}
      contentContainerStyle={scrollViewContainerStyle}
    >
      <YStack gap="$medium" flexDirection={firstSection === 'local' ? 'column-reverse' : 'column'}>
        <FormationSection onLayout={handleLayout('national')} data={formationsNational} visibility="national" theme="blue" />
        <FormationSection onLayout={handleLayout('local')} data={formationsLocal} visibility="local" theme="green" />
      </YStack>
    </ScrollView>
  )
})

const FormationDesktopScreenAllow: FormationScreenProps = ({ topVisual }) => {
  const { data } = useGetFormations()

  const formationsLocal = data.filter((formation) => formation.visibility === 'local')
  const firstSection = formationsLocal.length > 0 ? 'local' : 'national'
  const navItems = firstSection === 'local' ? items.slice().reverse() : items
  const [selected, setSelected] = useState<'local' | 'national'>(firstSection)

  const refs = useRef<ScrollViewRefs>({
    scrollRef: null,
    nationalLayout: null,
    localLayout: null,
    isWebPageLayoutScrollActive: false,
  })

  type TamRef = ComponentRef<typeof ScrollView>

  const scrollToSection = (x: 'national' | 'local') => {
    if (x === 'national' && refs.current.nationalLayout) {
      ;(refs.current?.scrollRef as TamRef | null)?.scrollTo(
        refs.current.isWebPageLayoutScrollActive
          ? {
              // @ts-expect-error web
              top: refs.current.nationalLayout.y - 140,
              behavior: 'smooth',
            }
          : { y: refs.current.nationalLayout.y - 140, animated: true },
      )
    }
    if (x === 'local' && refs.current?.localLayout) {
      ;(refs.current?.scrollRef as TamRef | null)?.scrollTo(
        refs.current.isWebPageLayoutScrollActive
          ? {
              // @ts-expect-error web
              top: refs.current.localLayout.y - 140,
              behavior: 'smooth',
            }
          : { y: refs.current.localLayout.y - 140, animated: true },
      )
    }
  }

  return (
    <FormationDesktopLayout topVisual={topVisual} leftComponent={<BreadCrumb items={navItems} vertical onChange={scrollToSection} value={selected} />}>
      <FormationDesktopScrollViewAllow ref={refs} onSectionChange={setSelected} data={data} />
    </FormationDesktopLayout>
  )
}

export const FormationDesktopScreenDeny: FormationScreenProps = ({ topVisual }) => {
  return (
    <FormationDesktopLayout topVisual={topVisual} leftComponent={null}>
      <YStack gap="$medium" padding="$medium" pt={topVisual / 2} justifyContent="center" alignItems="center">
        <VoxCard maxWidth={660} flex={1} width="100%">
          <FormationDenyCard topVisual={topVisual} />
        </VoxCard>
      </YStack>
    </FormationDesktopLayout>
  )
}

export const FormationDesktopScreenSkeleton: FormationScreenProps = ({ topVisual }) => {
  const scrollViewContainerStyle = useMemo(
    () => ({
      pt: 166,
      pl: '$medium',
      pr: '$medium',
      paddingBottom: getTokenValue('$xxlarge', 'space') + 166,
    }),
    [],
  )
  return (
    <FormationDesktopLayout
      topVisual={topVisual}
      leftComponent={
        <SkeCard>
          <SkeCard.Description />
        </SkeCard>
      }
    >
      <ScrollView contentContainerStyle={scrollViewContainerStyle}>
        <YStack gap="$medium">
          <FormationSectionSkeleton />
          <FormationSectionSkeleton />
        </YStack>
      </ScrollView>
    </FormationDesktopLayout>
  )
}

const FormationDesktopScreen: FormationScreenProps = (props) => {
  const { data } = useGetSuspenseProfil()
  return data?.tags?.find((tag) => tag.code.startsWith('adherent:')) ? <FormationDesktopScreenAllow {...props} /> : <FormationDesktopScreenDeny {...props} />
}

const Screen: FormationScreenProps = (props) => {
  return (
    <BoundarySuspenseWrapper fallback={<FormationDesktopScreenSkeleton {...props} />}>
      <FormationDesktopScreen {...props} />
    </BoundarySuspenseWrapper>
  )
}

export default Screen
