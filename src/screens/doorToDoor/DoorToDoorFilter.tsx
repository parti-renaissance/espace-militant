import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Spacing } from '../../styles'
import i18n from '../../utils/i18n'
import { DoorToDoorFilterDisplay } from './DoorToDoor'
import { DoorToDoorFilterItem } from './DoorToDoorFilterItem'

import papTodoIcon from '../../assets/images/papTodoIcon.png'
import papToFinishIcon from '../../assets/images/papToFinishIcon.png'
import papDoneIcon from '../../assets/images/papDoneIcon.png'

type Props = {
  filter: DoorToDoorFilterDisplay
  onPress: (mode: DoorToDoorFilterDisplay) => void
}

const DoorToDoorFilter = ({ filter, onPress }: Props) => {
  return (
    <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
      <DoorToDoorFilterItem filter="all" title={i18n.t('doorToDoor.filter.all')} onPress={() => onPress('all')} active={filter === 'all'} />
      <DoorToDoorFilterItem
        filter="todo"
        icon={papTodoIcon}
        title={i18n.t('doorToDoor.filter.to_do')}
        onPress={() => onPress('todo')}
        active={filter === 'todo'}
      />
      <DoorToDoorFilterItem
        filter="ongoing"
        icon={papToFinishIcon}
        title={i18n.t('doorToDoor.filter.ongoing')}
        onPress={() => onPress('ongoing')}
        active={filter === 'ongoing'}
      />
      <DoorToDoorFilterItem
        filter="completed"
        icon={papDoneIcon}
        title={i18n.t('doorToDoor.filter.completed')}
        onPress={() => onPress('completed')}
        active={filter === 'completed'}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.small,
  },
  contentContainer: {
    paddingHorizontal: Spacing.margin,
  },
})

export default DoorToDoorFilter
