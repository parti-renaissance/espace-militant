// AppStructure - Système de navigation et structure de l'application
export { default as Header } from './Header'
export { default as Layout } from './Layout/Layout'
export { LayoutContext, useLayoutContext } from './Layout/LayoutContext'
export { default as LayoutScrollView } from './Layout/LayoutScrollView'
export { default as LayoutFlatList } from './Layout/LayoutFlatList'

// Navigation components
export { SideBar, SideBarArea, WIDTH_MILITANT, WIDTH_COLLAPSED, MARGINS, type SideBarState } from './Navigation/SideBar'
export { default as TabBar } from './Navigation/TabBar'
export { NavItem, type NavItemProps } from './Navigation/NavItem'
export { NavItemDropdown, type NavItemSubItem } from './Navigation/NavItemDropdown'
export { default as NavSheet, type NavSheetRef } from './Navigation/NavSheet'
export { ScopeSelector } from './Navigation/ScopeSelector'
export { HelpMenuItems } from './Navigation/HelpMenuItems'

// Hooks
export { default as useLayoutSpacing, type UseLayoutSpacingOptions } from './hooks/useLayoutSpacing'
export { usePageLayoutScroll } from './hooks/usePageLayoutScroll'
export { useVisibleNavItems } from './hooks/useVisibleNavItems'

// Utils
export { isNavItemActive } from './utils'

