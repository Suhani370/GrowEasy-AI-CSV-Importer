import {
  allowedCrmStatuses,
  allowedDataSources,
  type CrmRecord,
} from "../types/crm.types.js";

export const normalizeCrmRecord = (
  record: CrmRecord
): CrmRecord => {
  const normalizedStatus = allowedCrmStatuses.includes(
    record.crm_status as (typeof allowedCrmStatuses)[number]
  )
    ? record.crm_status
    : "";

  const normalizedDataSource = allowedDataSources.includes(
    record.data_source as (typeof allowedDataSources)[number]
  )
    ? record.data_source
    : "";

  const normalizedDate =
    record.created_at &&
    !Number.isNaN(new Date(record.created_at).getTime())
      ? record.created_at
      : "";

  return {
    ...record,
    crm_status: normalizedStatus,
    data_source: normalizedDataSource,
    created_at: normalizedDate,
  };
};