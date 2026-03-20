import { Stack } from 'tamagui'
import Select from './Select'

export default {
  title: 'Select',
  component: Select,
}

export function Default() {
  return (
    <Stack gap="$medium" width={400}>
      <Select
        id={'select-id'}
        label={'This is the label'}
        // eslint-disable-next-line no-console
        onChange={console.log}
        options={[
          {
            label: 'Lorem',
            value: 'lorem',
          },
          {
            label: 'Ipsum',
            value: 'ipsum',
          },
        ]}
        placeholder={'This is the placeholder'}
        value={'lorem'}
      />
    </Stack>
  )
}
