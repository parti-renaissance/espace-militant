import config from '@/config/firebaseWebConfig'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'

const firebaseApp = initializeApp(config)

const messaging = getMessaging(firebaseApp)
