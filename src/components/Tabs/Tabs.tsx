import { createContext, memo, ReactElement, useCallback, useContext } from 'react'
import { styled, ThemeableStack, useMedia, withStaticProperties, YStackProps } from 'tamagui'
import _Tab, { TabProps } from './Tab'

const TabMemo = memo(_Tab)

export const TabsContext = createContext({
  activeTab: '',
  grouped: false as boolean | undefined,
  setActiveTab: (id: string) => {},
})

type TabsFrameProps<A extends string> = YStackProps & {
  onChange: (id: A) => void
  value: A
  children: ReactElement<_TabProps<A>>[]
  grouped?: boolean
}

const StyledFrame = styled(ThemeableStack, {
  gap: 16,
  padding: 16,
  variants: {
    grouped: {
      true: {
        bg: '$white1',
      },
    },
  },
} as const)

function TabsFrame<A extends string>({ children, value, onChange, grouped, ...rest }: TabsFrameProps<A>) {
  const media = useMedia()
  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onChange, grouped }}>
      <StyledFrame 
        grouped={grouped} 
        gap={media.gtSm ? 24 : 16}
        padding={media.gtSm ? 24 : 16}
        bg={grouped && media.gtMd ? '$colorTransparent' : (grouped ? '$white1' : undefined)}
        {...rest}
      >
        {children}
      </StyledFrame>
    </TabsContext.Provider>
  )
}

type _TabProps<A extends string> = {
  id: A
} & TabProps

export const Tab = <A extends string>(props: _TabProps<A>) => {
  const ctx = useContext(TabsContext)
  const handlePress = useCallback(() => ctx.setActiveTab(props.id), [props.id])
  return <TabMemo {...props} grouped={ctx.grouped} active={ctx.activeTab === props.id} onPress={handlePress} />
}

export const Tabs = withStaticProperties(TabsFrame, {
  Tab,
})
