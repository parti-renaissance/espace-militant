import messaging from '@react-native-firebase/messaging'
import { ENVIRONMENT } from '../Config'
import { Department } from '../core/entities/Department'
import { Region } from '../core/entities/Region'
import LocalStore from './store/LocalStore'

class PushRepository {
  private static instance: PushRepository
  private localStore = LocalStore.getInstance()
  private constructor() {}

  public async subscribeToGeneralTopic(): Promise<void> {
    const registrations = await this.localStore.getTopicsRegistration()
    if (registrations?.globalRegistered !== true) {
      await messaging().subscribeToTopic(this.createTopicName('global'))
      await this.localStore.updateTopicsRegistration({
        globalRegistered: true,
      })
    } else {
      // no-op: already registered
    }
  }

  public async subscribeToDepartment(department: Department): Promise<void> {
    const topicName = this.createTopicName('department_' + department.code)
    const registrations = await this.localStore.getTopicsRegistration()
    const previousTopic = registrations?.departementRegistered
    if (previousTopic !== topicName) {
      if (previousTopic !== undefined) {
        await messaging().unsubscribeFromTopic(previousTopic)
      }
      await messaging().subscribeToTopic(topicName)
      await this.localStore.updateTopicsRegistration({
        departementRegistered: topicName,
      })
    } else {
      // no-op
    }
  }

  public async subscribeToRegion(region: Region): Promise<void> {
    const topicName = this.createTopicName('region_' + region.code)
    const registrations = await this.localStore.getTopicsRegistration()
    const previousTopic = registrations?.regionRegistered
    if (previousTopic !== topicName) {
      if (previousTopic !== undefined) {
        await messaging().unsubscribeFromTopic(previousTopic)
      }
      await messaging().subscribeToTopic(topicName)
      await this.localStore.updateTopicsRegistration({
        regionRegistered: topicName,
      })
    } else {
      // no-op
    }
  }

  public async invalidatePushToken(): Promise<void> {
    return messaging()
      .deleteToken()
      .then(() => this.localStore.clearTopicsRegistration())
  }

  private createTopicName(topic: string): string {
    return ENVIRONMENT + '_jemarche_' + topic
  }

  public static getInstance(): PushRepository {
    if (!PushRepository.instance) {
      PushRepository.instance = new PushRepository()
    }
    return PushRepository.instance
  }
}

export default PushRepository
