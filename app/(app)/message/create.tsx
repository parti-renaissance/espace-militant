import React, { useState } from 'react'
import { FormFileImage } from '@/components/base/FormFileUpload/FormFileImage'
import Input from '@/components/base/Input/Input'
import Select, { SelectOption } from '@/components/base/Select/SelectV3'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import { VoxButton } from '@/components/Button'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { EventFormScreenSkeleton } from '@/features/events/components/EventForm'
import DescriptionInput from '@/features/events/components/EventForm/DescriptionInput'
import { ChevronDown, ChevronUp, Heading1, Image, Link, Plus, Text, Trash } from '@tamagui/lucide-icons'
import Head from 'expo-router/head'
import { uniqueId } from 'lodash'
import { View, XStack, YStack } from 'tamagui'

const HomeScreen: React.FC = () => {
  return (
    <PageLayout webScrollable>
      <PageLayout.SideBarLeft showOn="gtLg" maxWidth={100}></PageLayout.SideBarLeft>
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <_EventFormScreen />
      </BoundarySuspenseWrapper>
      <PageLayout.SideBarRight maxWidth={100} />
    </PageLayout>
  )
}

const createTitle = () => {
  return {
    type: 'title',
    text: '',
  } as const
}

const createImage = () => {
  return {
    type: 'image',
    url: undefined,
  } as const
}

const createRichText = () => {
  return {
    type: 'doc',
    content: [],
  } as const
}

const createButton = () => {
  return {
    type: 'button',
    link: undefined,
    label: '',
  } as const
}

type FieldsTypes = 'image' | 'button' | 'doc' | 'title'

const createField = (type: FieldsTypes) => {
  switch (type) {
    case 'image':
      return createImage()
    case 'button':
      return createButton()
    case 'doc':
      return createRichText()
    case 'title':
      return createTitle()
  }
}

const fieldOptions: SelectOption<FieldsTypes>[] = [
  {
    label: 'Un bouton',
    icon: Link,
    value: 'button',
  },
  {
    label: 'Un titre',
    icon: Heading1,
    value: 'title',
  },
  {
    value: 'image',
    icon: Image,
    label: 'Une image',
  },
  {
    value: 'doc',
    icon: Text,
    label: 'Un block Text',
  },
]

const RenderTitleField = () => <Input placeholder="Titre" color="gray" />
const RenderImageField = () => <FormFileImage />
const RenderRichTextField = () => <DescriptionInput value="" label="Corps" onChange={() => {}} onBlur={() => {}} />
const RenderButtonField = () => <VoxButton>bouton</VoxButton>

const RenderField = (props: { type: FieldsTypes }) => {
  switch (props.type) {
    case 'image':
      return <RenderImageField />
    case 'button':
      return <RenderButtonField />
    case 'doc':
      return <RenderRichTextField />
    case 'title':
      return <RenderTitleField />
  }
}

function _EventFormScreen() {
  const [fields, setFields] = useState<{ type: FieldsTypes; id: string }[]>([
    {
      type: 'title',
      id: uniqueId(),
    },
  ])

  const handleAddField = (appendTo: number) => (x: FieldsTypes) => {
    setFields((xs) => [...xs.slice(0, appendTo + 1), { type: x, id: uniqueId() }, ...xs.slice(appendTo + 1)])
  }

  const handleDeleteField = (id: string) => () => {
    setFields((xs) => {
      const fieldIndex = xs.findIndex((x) => x.id === id)
      if (fieldIndex === -1) return xs
      return [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
    })
  }

  const handleMove = (id: string, currentIndex: number, distance: number) => () => {
    setFields((xs) => {
      const fieldIndex = xs.findIndex((x) => x.id === id)
      if (fieldIndex === -1) return xs
      const field = xs[fieldIndex]
      const fieldRemoved = [...xs.slice(0, fieldIndex), ...xs.slice(fieldIndex + 1)]
      const fieldMoved = [...fieldRemoved.slice(0, currentIndex + distance), field, ...fieldRemoved.slice(currentIndex + distance)]
      return fieldMoved
    })
  }

  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nouvel événement')}</title>
      </Head>

      <YStack flex={1} gap="$medium" padding="$medium">
        {fields.map((x, i) => (
          <YStack
            gap="$medium"
            key={x.id}
            enterStyle={{
              opacity: 0,
              y: 10,
              scale: 0.9,
            }}
            exitStyle={{
              opacity: 0,
              y: -10,
              scale: 0.9,
            }}
          >
            <XStack alignItems="center" gap="$small" flex={1}>
              <XStack>
                <YStack gap="$xsmall">
                  <VoxButton theme="purple" variant="soft" size="sm" shrink iconLeft={ChevronUp} onPress={handleMove(x.id, i, -1)} />
                  <VoxButton theme="purple" variant="soft" size="sm" shrink iconLeft={ChevronDown} onPress={handleMove(x.id, i, +1)} />
                </YStack>
              </XStack>
              <View flex={1}>
                <RenderField type={x.type} />
              </View>
              <XStack>
                <VoxButton theme="purple" variant="soft" size="xl" shrink iconLeft={Trash} onPress={handleDeleteField(x.id)} />
              </XStack>
            </XStack>
            <XStack justifyContent="center">
              <Select theme="purple" size="xs" icon={Plus} label="Ajouter" noValuePlaceholder="un block" options={fieldOptions} onChange={handleAddField(i)} />
            </XStack>
          </YStack>
        ))}
      </YStack>
    </>
  )
}

export default HomeScreen
