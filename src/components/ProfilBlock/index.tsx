import { ComponentPropsWithoutRef, useState } from 'react'
import { Platform } from 'react-native'
import ProfileTags from '@/components/ActivistTags'
import { DropdownWrapper } from '@/components/base/Dropdown'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ProfilePicture from '@/components/ProfilePicture'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import ExecutiveRoleSelector from '@/features/profil/components/ExecutiveRoleSelector'
import { useDeleteProfilPicture, useGetProfil, useGetTags, usePostProfilPicture } from '@/services/profile/hook'
import { RestProfilResponse } from '@/services/profile/schema'
import { Delete, Plus, Repeat2, Settings2 } from '@tamagui/lucide-icons'
import { ImageResult, manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { XStack, YStack } from 'tamagui'
import ImageCroper from './CropImg'

const dropDownItems = [
  { title: 'Remplacer ma photo', id: 'change', icon: Repeat2 },
  { title: 'Supprimer ma photo', id: 'delete', color: '$orange6', icon: Delete },
]

const UploadPP = (props: { profil: RestProfilResponse }) => {
  const [image, setImage] = useState<ImageResult | null>(null)
  const [openCrop, setOpenCrop] = useState(false)
  const { mutate, isPending: postPending } = usePostProfilPicture({ uuid: props.profil.uuid })
  const { mutate: del, isPending: deletePending } = useDeleteProfilPicture({ uuid: props.profil.uuid })
  const isPending = postPending || deletePending

  const handleCloseCrop = (img?: string) => {
    if (img) mutate(img)
    setOpenCrop(false)
  }
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: Platform.OS === 'android',
      aspect: [1, 1],
      quality: Platform.OS === 'android' ? 0.75 : 1,
    })

    if (!result.canceled) {
      const _img = {
        uri: result.assets[0].uri,
        height: result.assets[0].height,
        width: result.assets[0].width,
      }
      if (Platform.OS === 'android') {
        manipulateAsync(
          _img.uri,
          [
            {
              resize: {
                width: 360,
                height: 360,
              },
            },
          ],
          { compress: 0.75, format: SaveFormat.WEBP, base64: true },
        ).then((result) => {
          mutate('data:image/webp;base64,' + result.base64!)
        })
      } else {
        setImage(_img)
        setOpenCrop(true)
      }
    }
  }

  const handleDropSelect = (id: string) => {
    if (id === 'change') {
      pickImage()
    } else {
      del()
    }
  }

  const [openDropdown, setOpenDropdown] = useState(false)

  const handleOpenDropdown = () => {
    props.profil.image_url ? setOpenDropdown(!openDropdown) : pickImage()
  }

  return (
    <YStack justifyContent="center" alignItems="center" gap="$medium">
      <ImageCroper image={image} open={openCrop} onClose={handleCloseCrop} />
      <XStack alignItems="center" justifyContent="center">
        <DropdownWrapper items={dropDownItems} onSelect={handleDropSelect} onOpenChange={setOpenDropdown} open={openDropdown}>
          <YStack>
            <ProfilePicture
              size="$11"
              loading={isPending}
              rounded
              fullName={props.profil.first_name + ' ' + props.profil.last_name}
              src={props.profil.image_url ?? undefined}
              alt="profil"
              onPress={handleOpenDropdown}
            />
            <VoxButton
              position="absolute"
              borderColor="$textOutline32"
              variant="outlined"
              borderWidth={2}
              bottom={0}
              right={0}
              borderRadius={999}
              shrink
              width={40}
              height={40}
              bg="white"
              onPress={handleOpenDropdown}
              iconLeft={props.profil.image_url ? Settings2 : Plus}
            />
          </YStack>
        </DropdownWrapper>
      </XStack>
    </YStack>
  )
}

export default function ({ editablePicture = true, ...props }: ComponentPropsWithoutRef<typeof VoxCard> & { editablePicture?: boolean }) {
  const { data: profil } = useGetProfil()
  const { tags } = useGetTags({ tags: ['elu', 'sympathisant', 'adherent'] })
  return profil ? (
    <VoxCard $sm={{ bg: 'transparent' }} {...props}>
      <VoxCard.Content>
        <YStack justifyContent="center" alignItems="center" gap="$medium">
          {editablePicture ? (
            <UploadPP profil={profil} />
          ) : (
            <ProfilePicture size="$6" rounded fullName={profil.first_name + ' ' + profil.last_name} src={profil.image_url ?? undefined} alt="profile" />
          )}
          <Text.LG>
            {profil.first_name} {profil.last_name}
          </Text.LG>
        </YStack>
        <ProfileTags tags={tags ?? []} justifyContent="center" />
        <Text.MD medium textAlign="center">
          {[profil.instances?.assembly?.name, profil.instances?.committee?.name].filter(Boolean).join(', ')}
        </Text.MD>
        {editablePicture ? <ExecutiveRoleSelector /> : null}
      </VoxCard.Content>
    </VoxCard>
  ) : (
    <SkeCard>
      <SkeCard.Content>
        <SkeCard.Image />
      </SkeCard.Content>
    </SkeCard>
  )
}
