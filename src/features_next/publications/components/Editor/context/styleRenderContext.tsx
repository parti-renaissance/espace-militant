import { createContext } from 'react'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import defaultTheme from '../themes/default-theme'

type StyleRendererContextType = S.MessageStyle

export const styleRendererContext = createContext<StyleRendererContextType>(defaultTheme)

export const StyleRendererContextProvider = styleRendererContext.Provider
