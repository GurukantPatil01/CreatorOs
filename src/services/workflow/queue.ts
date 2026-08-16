export class QueueService {
  private redisUrl: string

  constructor() {
    this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  }

  async addJob(stepName: 'transcribe' | 'analyze' | 'generate' | 'schedule' | 'publish', data: Record<string, any>) {
    const jobId = `job_${stepName}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    console.log(`[BullMQ Queue] Queued job '${stepName}' (ID: ${jobId}) with data:`, data)

    return {
      jobId,
      queue: stepName,
      status: 'active',
      redisUrl: this.redisUrl,
      timestamp: new Date().toISOString(),
    }
  }
}
