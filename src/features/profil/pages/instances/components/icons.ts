import { Circle, Diamond, Square, Triangle } from '@tamagui/lucide-icons'

import { createDoubleIcon } from '@/components/utils'

export const DoubleCircle = createDoubleIcon({ icon: Circle })
export const DoubleDiamond = createDoubleIcon({ icon: Diamond })
export const DoubleTriangle = createDoubleIcon({ icon: Triangle, middleIconOffset: 2.5 })
export const DoubleSquare = createDoubleIcon({ icon: Square })
