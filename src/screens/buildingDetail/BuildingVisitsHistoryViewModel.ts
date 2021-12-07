import { KeyValueListViewModel } from './KeyValueListView'
export interface BuildingHistoryViewModel {
  buildings: BuildingVisitsHistoryViewModel[]
}

export interface BuildingVisitsHistoryViewModel {
  buildingName: string
  dateRecords: BuildingVisitsDateRecordsViewModel[]
}

export interface BuildingVisitsDateRecordsViewModel {
  date: DateViewModel
  visitRecords: KeyValueListViewModel
}

export interface DateViewModel {
  dayNumber: string
  dateContext: string
}
