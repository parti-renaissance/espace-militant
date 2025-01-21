import { withStaticProperties } from 'tamagui'
import { ColFrame } from './Col'
import NavItem from './NavItem'
import Row from './Row'
import { TableFrame } from './Table'

const Table = withStaticProperties(TableFrame, {
  Row: Row,
  Col: ColFrame,
  NavItem: NavItem,
})

export default Table
