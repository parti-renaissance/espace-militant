import { Fragment } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useFileDownload } from '@/hooks/useFileDownload'
import { useGetTaxReceipts } from '@/services/profile/hook'
import { RestTaxReceiptsResponse } from '@/services/profile/schema'
import { Download } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'

const DownloadBtn = ({ receipt }: { receipt: RestTaxReceiptsResponse[number] }) => {
  const { handleDownload, isPending } = useFileDownload()
  const url = `/api/v3/profile/me/tax_receipts/${receipt.uuid}/file`
  const fileName = `reçu-fiscal-${receipt.label}.pdf`
  const handlePress = () => handleDownload({ url, fileName, mimeType: 'application/pdf', UTI: 'com.adobe.pdf' })
  return (
    <VoxButton theme="gray" size="lg" variant="text" iconLeft={Download} bg="white" onPress={handlePress} loading={isPending}>
      Télécharger
    </VoxButton>
  )
}

const DonationTaxReceiptCard = () => {
  const { data, isPending } = useGetTaxReceipts()
  if (isPending) {
    return (
      <SkeCard>
        <SkeCard.Content>
          <SkeCard.Title />
          <SkeCard.Content>
            <SkeCard.Description />
          </SkeCard.Content>
        </SkeCard.Content>
      </SkeCard>
    )
  }
  if (!data || data.length === 0) {
    return null
  }
  return (
    <VoxCard>
      <VoxCard.Content>
        <Text.LG>Reçu fiscaux</Text.LG>
        <VoxCard bg="$textSurface" inside>
          <VoxCard.Content>
            {data.map((receipt, i) => (
              <Fragment key={receipt.uuid}>
                <XStack gap="$small" flex={1} justifyContent="space-between" alignItems="center">
                  <Text.MD>{receipt.label}</Text.MD>
                  <DownloadBtn receipt={receipt} />
                </XStack>
                {i < data.length - 1 && <VoxCard.Separator borderColor="$gray/32" />}
              </Fragment>
            ))}
          </VoxCard.Content>
        </VoxCard>
      </VoxCard.Content>
    </VoxCard>
  )
}

export default DonationTaxReceiptCard
