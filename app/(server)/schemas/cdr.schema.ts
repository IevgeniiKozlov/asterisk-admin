import { z } from 'zod'

export const outputCdrSchema = z.object({
  id: z.number(),
  calldate: z.date(),
  clid: z.string(),
  src: z.string(),
  dst: z.string(),
  realdst: z.string(),
  dcontext: z.string(),
  channel: z.string(),
  dstchannel: z.string(),
  lastapp: z.string(),
  lastdata: z.string(),
  start: z.date(),
  answer: z.date(),
  end: z.date(),
  duration: z.number(),
  billsec: z.number(),
  disposition: z.string(),
  amaflags: z.number(),
  remoteip: z.string(),
  accountcode: z.string(),
  peeraccount: z.string(),
  uniqueid: z.string(),
  userfield: z.string(),
  did: z.string(),
  linkedid: z.string(),
  sequence: z.number(),
  filename: z.string().nullable(),
})

export type ICdr = z.TypeOf<typeof outputCdrSchema>