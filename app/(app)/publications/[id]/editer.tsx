import Error404 from '@/components/404/Error404'
import LayoutPage from '@/components/layouts/PageLayout/PageLayout'
import MessageEditorPage from '@/features/publications/pages/create-update'
import { useGetMessageContent } from '@/services/publications/hook'
import { useUserStore } from '@/store/user-store'
import { useLocalSearchParams } from 'expo-router'
import { Spinner } from 'tamagui'

export default function () {
  const params = useLocalSearchParams<{ id: string }>()
  if (!params.id) return <Error404 />

  const { defaultScope } = useUserStore()
  const query = useGetMessageContent({ messageId: params.id!, scope: defaultScope!, enabled: Boolean(defaultScope) })

  if (query.isPending || !query.data?.json_content)
    return (
      <LayoutPage>
        <LayoutPage.MainSingleColumn justifyContent="center" alignItems="center">
          <Spinner color="$blue5" />
        </LayoutPage.MainSingleColumn>
      </LayoutPage>
    )

  if (query.isError) return <Error404 />
  if (query.data) return <MessageEditorPage edit={query.data} />
}
