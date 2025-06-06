import React, { useState } from 'react'
import ActivistTags from '@/components/ActivistTags'
import Table from '@/components/base/Table'
import Text from '@/components/base/Text'
import ProfilePicture from '@/components/ProfilePicture'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import { usePaginatedEventPartcipants } from '@/services/events/hook'
import { getHumanFormattedDate } from '@/utils/date'
import { XStack, YStack } from 'tamagui'

export const EventParticipantsTable = ({ eventId }: { eventId: string }) => {
  const [pageIndex, setPageIndex] = useState(0)
  const { data, fetchNextPage, fetchPreviousPage, isFetchingNextPage, isFetchingPreviousPage, isLoading, error } = usePaginatedEventPartcipants({ eventId })

  if (isLoading) {
    return <TableSkeleton />
  }

  const currentPage = data?.pages[pageIndex]

  const handleFetchPreviousPage = () => {
    if (pageIndex === 0) return
    fetchPreviousPage().then(() => {
      setPageIndex((x) => x - 1)
    })
  }

  const handleFetchNextPage = () => {
    fetchNextPage().then(() => {
      setPageIndex((x) => x + 1)
    })
  }

  return (
    <YStack flex={1}>
      <XStack flex={1} width="100%" theme="purple">
        <Table splited="start" flex={1}>
          <Table.Col
            $sm={{
              width: 200,
            }}
          >
            <Table.Row.Header>
              <Text.SM semibold>Participants</Text.SM>
            </Table.Row.Header>
            {currentPage?.items.map(({ first_name, last_name, email_address, image_url, uuid }) => {
              return (
                <Table.Row key={'name' + uuid}>
                  <XStack gap="$medium" alignItems="center" flexShrink={1}>
                    <ProfilePicture size="$3" rounded src={image_url ?? undefined} fullName={`${first_name} ${last_name}`} alt="Image de profil de l'inscrit" />
                    <YStack flexShrink={1}>
                      <Text.SM>
                        {first_name} {last_name}
                      </Text.SM>
                      {email_address ? (
                        <Text.SM numberOfLines={2} secondary>
                          {email_address}
                        </Text.SM>
                      ) : null}
                    </YStack>
                  </XStack>
                </Table.Row>
              )
            })}
          </Table.Col>
        </Table>
        <Table.ScrollView splited="end" flex={1} horizontal>
          <Table.Col maxWidth={340}>
            <Table.Row.Header>
              <Text.SM semibold>Label(s)</Text.SM>
            </Table.Row.Header>

            {currentPage?.items.map(({ tags, uuid }) => {
              return (
                <Table.Row key={'tags' + uuid}>
                  <ActivistTags
                    flexShrink={1}
                    tags={
                      tags && tags.length > 0
                        ? tags
                        : [
                          {
                            type: 'other',
                            label: 'Citoyen',
                            code: '',
                          },
                        ]
                    }
                  />
                </Table.Row>
              )
            })}
          </Table.Col>

          <Table.Col minWidth={140}>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Téléphone
              </Text.SM>
            </Table.Row.Header>
            {currentPage?.items.map(({ phone, uuid }) => {
              return (
                <Table.Row key={'phone' + uuid}>
                  <Text.SM textAlign="center">{phone ?? 'Non indiqué'}</Text.SM>
                </Table.Row>
              )
            })}
          </Table.Col>

          <Table.Col>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Code Postal
              </Text.SM>
            </Table.Row.Header>
            {currentPage?.items.map(({ postal_code, uuid }) => {
              return (
                <Table.Row key={'postal_code' + uuid}>
                  <Text.SM textAlign="center">{postal_code ?? 'Non indiqué'}</Text.SM>
                </Table.Row>
              )
            })}
          </Table.Col>

          <Table.Col flex={1}>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Date inscription
              </Text.SM>
            </Table.Row.Header>
            {currentPage?.items.map(({ created_at, uuid }) => {
              return (
                <Table.Row key={'date' + uuid}>
                  <Text.SM>{created_at ? getHumanFormattedDate(new Date(created_at)) : ''}</Text.SM>
                </Table.Row>
              )
            })}
          </Table.Col>
        </Table.ScrollView>
      </XStack>
      <Table splited="bottom">
        <Table.Row.Footer justifyContent="space-between" flex={1}>
          {error ? (
            <XStack flex={1}>
              <Text.XSM flex={1} color="$textDanger" textAlign='center'>
                Impossible de récupérer la liste des participants
                {error?.code && ` (Erreur ${error?.code})`}
              </Text.XSM>
            </XStack>
          ) : (
            <>
              <Table.Col width={60}>
                <Text.SM color="$textDisabled">{currentPage?.metadata.total_items} Participant(s)</Text.SM>
              </Table.Col>
              <XStack gap="$medium" alignItems="center">
                <Text.SM>
                  Pages {currentPage?.metadata.current_page} - {currentPage?.metadata.last_page}
                </Text.SM>
                <XStack gap="$small">
                  <Table.NavItem
                    arrow="left"
                    disabled={pageIndex <= 0 || isFetchingPreviousPage}
                    loading={isFetchingPreviousPage}
                    onPress={handleFetchPreviousPage}
                  />
                  <Table.NavItem
                    arrow="right"
                    disabled={(currentPage != null && pageIndex + 1 >= currentPage.metadata.last_page) || isFetchingNextPage}
                    loading={isFetchingNextPage}
                    onPress={handleFetchNextPage}
                  />
                </XStack>
              </XStack>
            </>
          )}
        </Table.Row.Footer>
      </Table>
    </YStack>
  )
}

export const TableSkeleton = () => {
  const items = new Array(10).fill('') as string[]
  return (
    <YStack flex={1}>
      <XStack flex={1} width="100%" theme="purple">
        <Table splited="start">
          <Table.Col maxWidth={250}>
            <Table.Row.Header>
              <SkeCard.Line width={200} />
            </Table.Row.Header>
            {items.map((_, uuid) => {
              return (
                <Table.Row key={'name' + uuid}>
                  <XStack gap="$medium" alignItems="center" flexShrink={1}>
                    <SkeCard.Author />
                    <YStack flexShrink={1}>
                      <SkeCard.Line width={100} />
                    </YStack>
                  </XStack>
                </Table.Row>
              )
            })}
          </Table.Col>
        </Table>
        <Table splited="end" flex={1}>
          <Table.Col flex={1}>
            <Table.Row.Header>
              <SkeCard.Line width={100} />
            </Table.Row.Header>
            {items.map((_, uuid) => {
              return (
                <Table.Row key={'col2' + uuid}>
                  <SkeCard.Line width={100} />
                </Table.Row>
              )
            })}
          </Table.Col>
          <Table.Col maxWidth={200}>
            <Table.Row.Header>
              <SkeCard.Line width={100} />
            </Table.Row.Header>
            {items.map((_, uuid) => {
              return (
                <Table.Row key={'col3' + uuid}>
                  <SkeCard.Line width={100} />
                </Table.Row>
              )
            })}
          </Table.Col>
          <Table.Col maxWidth={200}>
            <Table.Row.Header>
              <SkeCard.Line width={100} />
            </Table.Row.Header>
            {items.map((_, uuid) => {
              return (
                <Table.Row key={'col3' + uuid}>
                  <SkeCard.Line width={100} />
                </Table.Row>
              )
            })}
          </Table.Col>
        </Table>
      </XStack>
      <Table splited="bottom">
        <Table.Row.Footer justifyContent="space-between" flex={1}>
          <Table.Col width={60}>
            <SkeCard.Line width={100} />
          </Table.Col>
          <XStack gap="$medium" alignItems="center">
            <XStack gap="$small">
              <SkeCard.Line width={20} />
              <SkeCard.Line width={20} />
            </XStack>
            <XStack gap="$small">
              <Table.NavItem arrow="left" disabled />
              <Table.NavItem arrow="right" disabled />
            </XStack>
          </XStack>
        </Table.Row.Footer>
      </Table>
    </YStack>
  )
}
