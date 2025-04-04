import React from 'react'
import Text from '@/components/base/Text'
import { XStack, YStack } from 'tamagui'
import Table from './index'

export default {
  title: 'Table',
  component: Table,
}

export const Default = () => {
  return (
    <Table width="100%">
      <Table.Col>
        <Table.Row.Header>
          <Text.SM textAlign="center" semibold>
            Name
          </Text.SM>
        </Table.Row.Header>
        <Table.Row>
          <Text.SM textAlign="center">Pierre</Text.SM>
        </Table.Row>
        <Table.Row>
          <Text.SM textAlign="center">Johna</Text.SM>
        </Table.Row>
        <Table.Row>
          <Text.SM textAlign="center">Victor</Text.SM>
        </Table.Row>
      </Table.Col>
      <Table.Col>
        <Table.Row.Header>
          <Text.SM textAlign="center" semibold>
            Age
          </Text.SM>
        </Table.Row.Header>
        <Table.Row>
          <Text.SM textAlign="center">30</Text.SM>
        </Table.Row>
        <Table.Row>
          <Text.SM textAlign="center">25</Text.SM>
        </Table.Row>

        <Table.Row>
          <Text.SM textAlign="center">32</Text.SM>
        </Table.Row>
      </Table.Col>
      <Table.Col>
        <Table.Row.Header>
          <Text.SM textAlign="center" semibold>
            Gender
          </Text.SM>
        </Table.Row.Header>
        <Table.Row>
          <Text.SM textAlign="center">Female</Text.SM>
        </Table.Row>

        <Table.Row>
          <Text.SM textAlign="center">Female</Text.SM>
        </Table.Row>

        <Table.Row>
          <Text.SM textAlign="center">Female</Text.SM>
        </Table.Row>
      </Table.Col>
    </Table>
  )
}

export const Splited = () => {
  return (
    <YStack width={400}>
      <XStack flex={1} width="100%">
        <Table splited="start" width={100}>
          <Table.Col>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Name
              </Text.SM>
            </Table.Row.Header>
            <Table.Row>
              <Text.SM textAlign="center">Pierre</Text.SM>
            </Table.Row>
            <Table.Row>
              <Text.SM textAlign="center">Johna</Text.SM>
            </Table.Row>
            <Table.Row>
              <Text.SM textAlign="center">Victor</Text.SM>
            </Table.Row>
          </Table.Col>
        </Table>
        <Table.ScrollView splited="end" horizontal flex={1}>
          <Table.Col>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Age
              </Text.SM>
            </Table.Row.Header>
            <Table.Row>
              <Text.SM textAlign="center">30</Text.SM>
            </Table.Row>
            <Table.Row>
              <Text.SM textAlign="center">25</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">32</Text.SM>
            </Table.Row>
          </Table.Col>
          <Table.Col>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Gender
              </Text.SM>
            </Table.Row.Header>
            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>
          </Table.Col>
          <Table.Col>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Gender
              </Text.SM>
            </Table.Row.Header>
            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>
          </Table.Col>
          <Table.Col>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Gender
              </Text.SM>
            </Table.Row.Header>
            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>
          </Table.Col>
          <Table.Col>
            <Table.Row.Header>
              <Text.SM textAlign="center" semibold>
                Gender
              </Text.SM>
            </Table.Row.Header>
            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>

            <Table.Row>
              <Text.SM textAlign="center">Female</Text.SM>
            </Table.Row>
          </Table.Col>
        </Table.ScrollView>
      </XStack>
      <Table splited="bottom">
        <Table.Row.Footer justifyContent="space-between">
          <Table.Row>
            <Text.SM color="$textDisabled">Lorem ipsum</Text.SM>
          </Table.Row>
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
