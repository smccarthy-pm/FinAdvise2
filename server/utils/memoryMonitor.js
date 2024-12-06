import v8 from 'v8';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set memory limit to 4GB or use environment variable
const MAX_MEMORY_SIZE = parseInt(process.env.MAX_MEMORY_SIZE || '4096');
v8.setFlagsFromString(`--max_old_space_size=${MAX_MEMORY_SIZE}`);

// Convert bytes to MB for readability
const bytesToMB = bytes => Math.round(bytes / 1024 / 1024 * 100) / 100;

export class MemoryMonitor {
    constructor(options = {}) {
        this.warningThreshold = options.warningThreshold || 0.8; // 80% of max memory
        this.criticalThreshold = options.criticalThreshold || 0.9; // 90% of max memory
        this.logInterval = options.logInterval || 5 * 60 * 1000; // 5 minutes
        this.logPath = options.logPath || path.join(__dirname, '../../logs/memory');
        this.isMonitoring = false;
        this.lastCleanup = Date.now();
        this.cleanupInterval = options.cleanupInterval || 30 * 60 * 1000; // 30 minutes
    }

    async init() {
        // Ensure log directory exists
        await fs.mkdir(this.logPath, { recursive: true });
        
        // Start monitoring
        this.startMonitoring();
        
        // Setup cleanup interval
        setInterval(() => this.performCleanup(), this.cleanupInterval);
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.monitorInterval = setInterval(() => this.checkMemory(), this.logInterval);
        
        // Monitor uncaught exceptions
        process.on('uncaughtException', (error) => this.handleError(error));
        process.on('unhandledRejection', (error) => this.handleError(error));
    }

    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        clearInterval(this.monitorInterval);
        this.isMonitoring = false;
    }

    async checkMemory() {
        const memoryUsage = process.memoryUsage();
        const heapUsed = bytesToMB(memoryUsage.heapUsed);
        const heapTotal = bytesToMB(memoryUsage.heapTotal);
        const rss = bytesToMB(memoryUsage.rss);
        const external = bytesToMB(memoryUsage.external);
        
        const heapPercentage = memoryUsage.heapUsed / memoryUsage.heapTotal;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            metrics: {
                heapUsed,
                heapTotal,
                rss,
                external,
                heapPercentage: Math.round(heapPercentage * 100)
            }
        };

        // Log to file
        await this.logMemoryMetrics(logEntry);

        // Check thresholds and take action if needed
        if (heapPercentage > this.criticalThreshold) {
            await this.handleCriticalMemory(logEntry);
        } else if (heapPercentage > this.warningThreshold) {
            await this.handleWarningMemory(logEntry);
        }
    }

    async logMemoryMetrics(logEntry) {
        const date = new Date();
        const logFile = path.join(
            this.logPath,
            `memory-${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`
        );

        try {
            await fs.appendFile(
                logFile,
                JSON.stringify(logEntry) + '\n',
                'utf8'
            );
        } catch (error) {
            console.error('Failed to write memory metrics:', error);
        }
    }

    async handleWarningMemory(logEntry) {
        console.warn(`Memory usage warning: ${logEntry.metrics.heapPercentage}% of heap used`);
        global.gc?.(); // Run garbage collection if available
    }

    async handleCriticalMemory(logEntry) {
        console.error(`Critical memory usage: ${logEntry.metrics.heapPercentage}% of heap used`);
        await this.performCleanup();
        
        if (logEntry.metrics.heapPercentage > 95) {
            console.error('Memory usage critically high, restarting process');
            process.exit(1); // PM2 or similar process manager will restart the application
        }
    }

    async performCleanup() {
        this.lastCleanup = Date.now();
        
        // Force garbage collection if available
        if (global.gc) {
            try {
                global.gc();
            } catch (error) {
                console.error('Failed to run garbage collection:', error);
            }
        }

        // Clear module caches if they're taking too much memory
        Object.keys(require.cache).forEach((key) => {
            if (key.includes('node_modules')) return; // Skip node_modules
            delete require.cache[key];
        });

        // Clean old log files (keep last 7 days)
        try {
            const files = await fs.readdir(this.logPath);
            const now = Date.now();
            const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

            for (const file of files) {
                const filePath = path.join(this.logPath, file);
                const stats = await fs.stat(filePath);
                
                if (stats.ctimeMs < sevenDaysAgo) {
                    await fs.unlink(filePath);
                }
            }
        } catch (error) {
            console.error('Failed to clean old log files:', error);
        }
    }

    async handleError(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: {
                message: error.message,
                stack: error.stack,
                memory: process.memoryUsage()
            }
        };

        try {
            const errorLogFile = path.join(this.logPath, 'error.log');
            await fs.appendFile(
                errorLogFile,
                JSON.stringify(errorLog) + '\n',
                'utf8'
            );
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }
    }
}

// Export singleton instance
export const memoryMonitor = new MemoryMonitor();
