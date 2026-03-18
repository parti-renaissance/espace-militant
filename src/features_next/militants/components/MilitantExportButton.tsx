import React, { useCallback } from 'react'
import { Share } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import { useFileDownload } from '@/hooks/useFileDownload'
import { useGetExecutiveScopes } from '@/services/profile/hook'

export function MilitantExportButton({ scope }: { scope: string }) {
  const { handleDownload, isPending } = useFileDownload()
  const { hasFeature } = useGetExecutiveScopes()

  const canExport = hasFeature('contacts_export', scope)

  const handleExport = useCallback(() => {
    if (!scope || isPending) return

    const date = new Date().toISOString().slice(0, 10)
    handleDownload({
      url: `/api/v3/adherents.xlsx?scope=${encodeURIComponent(scope)}`,
      fileName: `liste_des_militants_${scope}_${date}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      UTI: 'org.openxmlformats.spreadsheetml.sheet',
      publicDownload: false,
    })
  }, [handleDownload, isPending, scope])

  if (!canExport) return null

  return (
    <VoxButton variant="text" theme="gray" size="sm" iconLeft={Share} onPress={handleExport} loading={isPending}>
      Exporter
    </VoxButton>
  )
}

