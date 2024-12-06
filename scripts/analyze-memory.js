import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function analyzeMemoryLogs() {
    const logsDir = path.join(__dirname, '../logs/memory');
    
    try {
        const files = await fs.readdir(logsDir);
        const memoryFiles = files.filter(f => f.startsWith('memory-'));
        
        let allMetrics = [];
        let warnings = [];
        let criticals = [];
        
        for (const file of memoryFiles) {
            const content = await fs.readFile(path.join(logsDir, file), 'utf8');
            const lines = content.trim().split('\n');
            
            for (const line of lines) {
                const entry = JSON.parse(line);
                allMetrics.push(entry);
                
                if (entry.metrics.heapPercentage >= 90) {
                    criticals.push(entry);
                } else if (entry.metrics.heapPercentage >= 80) {
                    warnings.push(entry);
                }
            }
        }
        
        // Calculate statistics
        const stats = calculateStats(allMetrics);
        
        // Generate report
        const report = {
            totalSamples: allMetrics.length,
            timeRange: {
                start: new Date(allMetrics[0].timestamp).toLocaleString(),
                end: new Date(allMetrics[allMetrics.length - 1].timestamp).toLocaleString()
            },
            memoryStats: stats,
            warnings: warnings.length,
            criticals: criticals.length,
            recommendations: generateRecommendations(stats, warnings, criticals)
        };
        
        // Save report
        const reportPath = path.join(logsDir, `memory-analysis-${new Date().toISOString().split('T')[0]}.json`);
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log('Memory Analysis Report:');
        console.log('======================');
        console.log(`Total Samples: ${report.totalSamples}`);
        console.log(`Time Range: ${report.timeRange.start} to ${report.timeRange.end}`);
        console.log('\nMemory Statistics:');
        console.log(`  Average Heap Usage: ${report.memoryStats.avgHeapUsed.toFixed(2)} MB`);
        console.log(`  Max Heap Usage: ${report.memoryStats.maxHeapUsed.toFixed(2)} MB`);
        console.log(`  Average Heap Percentage: ${report.memoryStats.avgHeapPercentage.toFixed(2)}%`);
        console.log(`  Warning Events: ${report.warnings}`);
        console.log(`  Critical Events: ${report.criticals}`);
        console.log('\nRecommendations:');
        report.recommendations.forEach(rec => console.log(`- ${rec}`));
        
    } catch (error) {
        console.error('Error analyzing memory logs:', error);
    }
}

function calculateStats(metrics) {
    const heapUsed = metrics.map(m => m.metrics.heapUsed);
    const heapTotal = metrics.map(m => m.metrics.heapTotal);
    const percentages = metrics.map(m => m.metrics.heapPercentage);
    
    return {
        avgHeapUsed: average(heapUsed),
        maxHeapUsed: Math.max(...heapUsed),
        minHeapUsed: Math.min(...heapUsed),
        avgHeapTotal: average(heapTotal),
        avgHeapPercentage: average(percentages),
        maxHeapPercentage: Math.max(...percentages),
        standardDeviation: standardDeviation(heapUsed)
    };
}

function generateRecommendations(stats, warnings, criticals) {
    const recommendations = [];
    
    if (stats.avgHeapPercentage > 70) {
        recommendations.push('Consider increasing the maximum heap size as average usage is high');
    }
    
    if (criticals.length > 0) {
        recommendations.push('Critical memory usage detected. Review application for memory leaks');
    }
    
    if (stats.standardDeviation > stats.avgHeapUsed * 0.3) {
        recommendations.push('High memory usage variation detected. Consider implementing better memory management');
    }
    
    if (warnings.length > metrics.length * 0.1) {
        recommendations.push('Frequent memory warnings. Consider implementing memory pooling or caching strategies');
    }
    
    return recommendations;
}

function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function standardDeviation(arr) {
    const avg = average(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(average(squareDiffs));
}

// Run the analysis
analyzeMemoryLogs().catch(console.error);
