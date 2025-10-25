import * as core from '@actions/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
  }

  public static getInstance(logLevel?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  public debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG ${timestamp}] ${message}`, ...args);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const timestamp = new Date().toISOString();
      console.log(`[INFO ${timestamp}] ${message}`, ...args);
      core.info(message);
    }
  }

  public warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const timestamp = new Date().toISOString();
      console.warn(`[WARN ${timestamp}] ${message}`, ...args);
      core.warning(message);
    }
  }

  public error(message: string, error?: Error, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const timestamp = new Date().toISOString();
      console.error(`[ERROR ${timestamp}] ${message}`, ...args);

      if (error) {
        console.error('Stack trace:', error.stack);
        core.setFailed(error.message);
      } else {
        core.setFailed(message);
      }
    }
  }

  public group(title: string, fn: () => void): void {
    console.group(title);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  }

  public time(label: string): void {
    console.time(label);
  }

  public timeEnd(label: string): void {
    console.timeEnd(label);
  }
}
