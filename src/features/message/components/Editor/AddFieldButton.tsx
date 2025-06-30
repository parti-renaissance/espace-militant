import { styled, ThemeableStack } from "tamagui"
import { EditorMethods } from "./types"
import { memo, RefObject } from "react"
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { Control } from "react-hook-form"
import MessageEditorAddToolbar from "./AddToolBar"
import { TouchableOpacity } from "react-native"
import { Plus } from "@tamagui/lucide-icons"

const AddFieldButtonContainer = styled(ThemeableStack, {
    height: 28,
    position: 'relative',
    zIndex: 1000,
  })
  
  const AddFieldButtonSeparator = styled(ThemeableStack, {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderBottomWidth: 0,
    borderColor: '$gray3',
    borderStyle: 'dashed',
  })
  
  const AddFieldButtonCircle = styled(ThemeableStack, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(145,158,171,0.3)',
    height: 52,
    width: 52,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  })
  
  const AddFieldButtonInner = styled(ThemeableStack, {
    backgroundColor: 'white',
    height: 36,
    width: 36,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  })
  
  type AddFieldButtonProps = {
    display: boolean
    control: Control<S.GlobalForm>
    editorMethods: RefObject<EditorMethods>
    field?: S.FieldsArray[number]
    asLast?: boolean
    showAddBar: boolean
    onShowAddBar: () => void
    onCloseAddBar?: () => void
  }
  
  export const AddFieldButton = memo((props: AddFieldButtonProps) => {
    if (!props.display) {
      return null
    }
  
    return (
      <AddFieldButtonContainer>
        <AddFieldButtonSeparator />
        {props.showAddBar ? (
          <MessageEditorAddToolbar
            control={props.control}
            editorMethods={props.editorMethods}
            field={props.field}
            asLast={props.asLast}
            onClose={props.onCloseAddBar}
          />
        ) : (
          <AddFieldButtonCircle>
            <TouchableOpacity onPress={props.onShowAddBar}>
              <AddFieldButtonInner>
                <Plus color="black" size={16} />
              </AddFieldButtonInner>
            </TouchableOpacity>
          </AddFieldButtonCircle>
        )}
      </AddFieldButtonContainer>
    )
  })
  
  AddFieldButton.displayName = 'AddFieldButton'