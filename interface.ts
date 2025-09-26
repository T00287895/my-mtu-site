export interface ScheduleRecordI {
    startAt: number
    endAt: number
    title?: string
    room?: string
    tutor?: string
}

export interface ScheduleI {
    monday: ScheduleRecordI[]
    tuesday: ScheduleRecordI[]
    wednesday: ScheduleRecordI[]
    thursday: ScheduleRecordI[]
    friday: ScheduleRecordI[]
    saturday: ScheduleRecordI[]
    sunday: ScheduleRecordI[]
}