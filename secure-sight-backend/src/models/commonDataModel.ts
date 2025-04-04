import { HydratedDocumentFromSchema, model, Schema } from "mongoose";

const TitleDescSchema = new Schema({
  title: String,
  desc: String
})

const AdvisoryChartSchema = new Schema({
  ioc: {
    type: Number,
    default: 0
  },
  advisories: {
    type: Number,
    default: 0
  }
})

const IOCChartSchema = new Schema({
  ip: {
    type: Number,
    default: 0
  },
  url: {
    type: Number,
    default: 0
  },
  domain: {
    type: Number,
    default: 0
  },
  hash: {
    type: Number,
    default: 0
  },
  sender_email: {
    type: Number,
    default: 0
  }
})

const ThreatIntelSummarySchema = new Schema({
  advisory_chart: AdvisoryChartSchema,
  ioc_chart: IOCChartSchema
})

const commonDataSchema = new Schema({
  rType: String,
  tg_cyber_cri: [TitleDescSchema],
  tg_vul: [TitleDescSchema],
  tg_mal: [TitleDescSchema],
  tg_mitre: [TitleDescSchema],
  threat_intel_summary: ThreatIntelSummarySchema,
  uAt: Date,
  uBy: String
})

export type CommonDataDocumentType = HydratedDocumentFromSchema<typeof commonDataSchema>

export default model('CommonData', commonDataSchema)