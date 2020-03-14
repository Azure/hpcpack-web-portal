import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs'
import { DefaultService, BASE_PATH, Configuration, NodeMetric, NodeAvailability, MetricData, NodeState, RestProperty } from '../api-client'
import { Node, INode } from '../models/node'
import { Job } from '../models/job'
import { ILooper, Looper, ObservableCreator } from './looper.service'

export * from '../api-client'

export type NodeOperation = 'start' | 'stop' | 'reboot' | 'shutdown' | 'bringOnline' | 'takeOffline';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends DefaultService {
  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    super(httpClient, basePath, configuration);
  }

  repeat<T>(operation: Observable<T> | ObservableCreator<T>, interval: number): Observable<T> {
    return new Observable<T>(subscriber => {
      let looper = Looper.start(
        operation,
        {
          next: (data) => {
            subscriber.next(data);
          },
          error: (err) => {
          //An error handler here will prevent an error from stopping the loop
          console.log(err);
          }
        },
        interval
      );
      return () => looper.stop();
    });
  }

  getClusterNodeAvailabilityInLoop(updateInterval: number): Observable<NodeAvailability> {
    return this.repeat(this.getClusterNodeAvailability(), updateInterval);
  }

  getClusterJobMetricsInLoop(updateInterval: number): Observable<MetricData> {
    return this.repeat(this.getClusterJobMetrics(), updateInterval);
  }

  getLatestClusterMetricInLoop(metric: string, timeWindow: number, updateInterval: number): Observable<MetricData> {
    let producer: ObservableCreator<MetricData> = () => {
      let to = Date.now();
      let from = to - timeWindow;
      return this.getClusterMetricHistory(metric, new Date(from), new Date(to));
    };
    return this.repeat(producer, updateInterval);
  }

  getNodeMetricsInLoop(metric: string, updateInterval: number): Observable<NodeMetric[]> {
    return new Observable<NodeMetric[]>(subscriber => {
      let looper = Looper.start(
        this.getNodeMetrics(metric),
        {
          next: (data) => {
            subscriber.next(data);
          },
          //An error handler here will prevent an error from stopping the loop
          error: (err) => {
            console.error(err);
          }
        },
        updateInterval,
      );
      return () => looper.stop();
    });
  }

  doNodeOperationAndWatch(nodeName: string, operation: NodeOperation, targetState: NodeState, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return new Observable<Node>(subscriber => {
      let looper: Looper<INode>;
      let sub = this.operateClusterNode(nodeName, operation).subscribe(_ => {
        looper = Looper.start(
          this.getClusterNode(nodeName),
          {
            next: (data, looper) => {
              let node = Node.fromJson(data);
              subscriber.next(node);

              if (node.State === targetState) {
                looper.stop();
              }
            },
            stop: () => {
              subscriber.complete();
            }
          },
          updateInterval,
          updateExpiredIn
        );
      });
      return () => {
        sub.unsubscribe();
        if (looper) {
          looper.stop();
        }
      }
    });
  }

  bringNodeOnlineAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'bringOnline', 'Online', updateInterval, updateExpiredIn);
  }

  takeNodeOfflineAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'takeOffline', 'Offline', updateInterval, updateExpiredIn);
  }

  startNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'start', 'Offline', updateInterval, updateExpiredIn);
  }

  stopNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'stop', 'NotDeployed', updateInterval, updateExpiredIn);
  }

  //TODO: Is "Offline" the end state of reboot?
  rebootNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'reboot', 'Offline', updateInterval, updateExpiredIn);
  }

  //TODO: What's the end state for shutdown?
  shutdownNodeAndWatch(name: string, updateInterval: number, updateExpiredIn: number): Observable<Node> {
    return this.doNodeOperationAndWatch(name, 'shutdown', 'Unknown', updateInterval, updateExpiredIn);
  }

  doJobOperationAndWatch(operation: Observable<any>, jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return new Observable<Job>(subscriber => {
      let looper: Looper<RestProperty[]>;
      let sub = operation.subscribe(_ => {
        looper = Looper.start(
          this.getJob(jobId),
          {
            next: (data, looper) => {
              let job = Job.fromProperties(data);
              subscriber.next(job);

              if (job.Ended) {
                looper.stop();
              }
            },
            stop: () => {
              subscriber.complete();
            }
          },
          updateInterval,
          updateExpiredIn
        );
        return () => looper.stop();
      });
      return () => {
        sub.unsubscribe();
        if (looper) {
          looper.stop();
        }
      }
    });
  }

  requeueJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.requeueJob(jobId), jobId, updateInterval, updateExpiredIn);
  }

  submitJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.submitJob(jobId), jobId, updateInterval, updateExpiredIn);
  }

  cancelJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.cancelJob(jobId), jobId, updateInterval, updateExpiredIn);
  }

  finishJobAndWatch(jobId: number, updateInterval: number, updateExpiredIn: number): Observable<Job> {
    return this.doJobOperationAndWatch(this.finishJob(jobId), jobId, updateInterval, updateExpiredIn);
  }
}
