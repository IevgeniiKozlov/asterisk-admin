const columns = [
  { name: 'Дата и время', uid: 'calldate' },
  { name: 'Кто звонил', uid: 'operator' }, // src in database
  { name: 'Статус', uid: 'disposition' },
  { name: 'Куда звонили', uid: 'dst' },
  { name: 'Ожидание ответа', uid: 'duration' },
  { name: 'Обработка звонка', uid: 'billsec' },
  { name: 'Тариф', uid: 'tarif' }, //не нашел в таблице, пока свое наименование(вычисляется динамически)
  { name: 'Запись звонка', uid: 'uniqeid' },
]

const users = [
  {
    id: 1350,
    calldate: '2023-11-30T14:30:01.000Z',
    operator: '2001',
    disposition: 'Не отвечено',
    dst: '79141344734',
    duration: '9',
    billsec: '0',
    tarif: '0.00 USD',
    filename: 'Тут будет запись звонка ',
  },
  {
    id: 1349,
    calldate: '2023-11-30T14:29:06.000Z',
    operator: '2001',
    disposition: 'Отвечено',
    dst: '79227689647',
    duration: '42',
    billsec: '5',
    tarif: '0.10 USD',
    filename: 'Тут будет запись звонка ',
  },
  {
    id: 1348,
    calldate: '2023-11-30T14:27:52.000Z',
    operator: '2001',
    disposition: 'Не отвечено',
    dst: '79505859099',
    duration: '46',
    billsec: '5',
    tarif: '0.00 USD',
    filename: 'Тут будет запись звонка ',
  },
]

export { columns, users }
