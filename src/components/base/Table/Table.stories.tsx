import React from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { XStack, YStack } from 'tamagui'
import Table from './index'

export default {
  title: 'Table',
  component: Table,
}

export const Default = () => {
  return (
    <Table width={700}>
      <Table.Row.Header>
        <Table.Col width={60}>
          <Text.SM textAlign="center" semibold>
            Name
          </Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center" semibold>
            Age
          </Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center" semibold>
            Gender
          </Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM semibold textAlign="center">
            Action
          </Text.SM>
        </Table.Col>
      </Table.Row.Header>
      <Table.Row>
        <Table.Col width={60}>
          <Text.SM textAlign="center">Pierre</Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center">30</Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center">Male</Text.SM>
        </Table.Col>
        <Table.Col width={60} flexDirection="row" justifyContent="center">
          <VoxButton variant="soft" theme="orange" size="sm" children="delete" />
        </Table.Col>
      </Table.Row>
      <Table.Row>
        <Table.Col width={60}>
          <Text.SM textAlign="center">Johna</Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center">25</Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center">Female</Text.SM>
        </Table.Col>
        <Table.Col width={60} flexDirection="row" justifyContent="center">
          <VoxButton variant="soft" theme="orange" size="sm" children="delete" />
        </Table.Col>
      </Table.Row>
      <Table.Row>
        <Table.Col width={60}>
          <Text.SM textAlign="center">Victor</Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center">32</Text.SM>
        </Table.Col>
        <Table.Col width={60}>
          <Text.SM textAlign="center">Female</Text.SM>
        </Table.Col>
        <Table.Col width={60} flexDirection="row" justifyContent="center">
          <VoxButton variant="soft" theme="orange" size="sm" children="delete" />
        </Table.Col>
      </Table.Row>
      <Table.Row.Footer justifyContent="space-between">
        <Table.Col width={60}>
          <Text.SM color="$textDisabled">Lorem ipsum</Text.SM>
        </Table.Col>
        <XStack gap="$medium" alignItems="center">
          <Text.SM>Lorem ipsum 1 - 2</Text.SM>
          <XStack gap="$small">
            <Table.NavItem arrow="left" disabled />
            <Table.NavItem arrow="right" />
          </XStack>
        </XStack>
      </Table.Row.Footer>
    </Table>
  )
}

export const Splited = () => {
  return (
    <YStack width={300}>
      <XStack>
        <Table splited="start" width={100}>
          <Table.Row.Header>
            <Table.Col width={60}>
              <Text.SM textAlign="center" semibold>
                Name
              </Text.SM>
            </Table.Col>
          </Table.Row.Header>
          <Table.Row>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Pierre</Text.SM>
            </Table.Col>
          </Table.Row>
          <Table.Row>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Johna</Text.SM>
            </Table.Col>
          </Table.Row>
        </Table>
        <Table.ScrollView splited="end" horizontal>
          <Table.Row.Header>
            <Table.Col width={60}>
              <Text.SM textAlign="center" semibold>
                Age
              </Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center" semibold>
                Gender
              </Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center" semibold>
                Age
              </Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center" semibold>
                Gender
              </Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center" semibold>
                Age
              </Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center" semibold>
                Gender
              </Text.SM>
            </Table.Col>
          </Table.Row.Header>
          <Table.Row>
            <Table.Col width={60}>
              <Text.SM textAlign="center">30</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Male</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">25</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">25</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Col>
          </Table.Row>
          <Table.Row>
            <Table.Col width={60}>
              <Text.SM textAlign="center">25</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">25</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">25</Text.SM>
            </Table.Col>
            <Table.Col width={60}>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Col>
          </Table.Row>
        </Table.ScrollView>
      </XStack>
      <Table splited="bottom">
        <Table.Row.Footer justifyContent="space-between">
          <Table.Col width={60}>
            <Text.SM color="$textDisabled">Lorem ipsum</Text.SM>
          </Table.Col>
          <XStack gap="$medium" alignItems="center">
            <Text.SM>Lorem ipsum 1 - 2</Text.SM>
            <XStack gap="$small">
              <Table.NavItem arrow="left" disabled />
              <Table.NavItem arrow="right" />
            </XStack>
          </XStack>
        </Table.Row.Footer>
      </Table>
    </YStack>
  )
}
