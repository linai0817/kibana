/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Logger } from 'kibana/server';
import { PromiseReturnType } from '../../../../../observability/typings/common';
import { Setup, SetupTimeRange } from '../../helpers/setup_request';
import { getAnomalySeries } from './get_anomaly_data';
import { getApmTimeseriesData } from './get_timeseries_data';
import { ApmTimeSeriesResponse } from './get_timeseries_data/transform';

function getDates(apmTimeseries: ApmTimeSeriesResponse) {
  return apmTimeseries.responseTimes.avg.map((p) => p.x);
}

export type TimeSeriesAPIResponse = PromiseReturnType<
  typeof getTransactionCharts
>;
export async function getTransactionCharts(options: {
  serviceName: string;
  transactionType: string | undefined;
  transactionName: string | undefined;
  setup: Setup & SetupTimeRange;
  searchAggregatedTransactions: boolean;
  logger: Logger;
}) {
  const apmTimeseries = await getApmTimeseriesData(options);
  const anomalyTimeseries = await getAnomalySeries({
    ...options,
    timeSeriesDates: getDates(apmTimeseries),
  });

  return {
    apmTimeseries,
    anomalyTimeseries,
  };
}
