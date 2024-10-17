export type Cdr = {
  id: number
  calldate: string
  clid: string
  src: string
  dst: string
  realdst: string
  dcontext: string
  channel: string
  dstchannel: string
  lastapp: string
  lastdata: string
  start: string
  answer: string
  end: string
  duration: number
  billsec: number
  disposition: string
  amaflags: number
  remoteip: string
  accountcode: string
  peeraccount: string
  uniqueid: string
  userfield: string
  did: string
  linkedid: string
  sequence: number
  filename: string | null
}

const columns = [
  { name: 'Дата и время', uid: 'calldate', sortable: true },
  { name: 'Кто звонил', uid: 'src', sortable: true },
  { name: 'Статус', uid: 'disposition', sortable: true },
  { name: 'Куда звонили', uid: 'dst', sortable: true },
  { name: 'Ожидание ответа', uid: 'duration' },
  { name: 'Обработка звонка', uid: 'billsec' },
  { name: 'Тариф', uid: 'sequence', sortable: true }, //в таблице забираем любое не используемое с type number
  { name: 'Запись звонка', uid: 'filename' },
]

const statusOptions = [
  { name: 'Отвечено', uid: 'ANSWERED' },
  { name: 'Не отвечено', uid: 'NO ANSWER' },
  { name: 'Занято', uid: 'BUSY' },
  { name: 'Ошибка', uid: 'FAILED' },
]

export { columns, statusOptions }
