import z from 'zod'
import { Poll } from '../core/entities/Poll'
import { PollResult } from '../core/entities/PollResult'
import { DataSource } from './DataSource'
import { RestPollResultRequestMapper } from './mapper/RestPollResultRequestMapper'
import ApiService from './network/ApiService'
import CacheManager from './store/CacheManager'

class PollsRepository {
  private static instance: PollsRepository
  private apiService = ApiService.getInstance()
  private cacheManager = CacheManager.getInstance()
  private memoryCachedPolls: Array<Poll> = []
  private constructor() {}

  public async getPolls(dataSource: DataSource = 'remote'): Promise<Array<Poll>> {
    const cacheKey = 'polls'
    switch (dataSource) {
      case 'cache': {
        const cachedPolls = await this.cacheManager.getFromCache(cacheKey)
        if (z.array(z.object({})).safeParse(cachedPolls).success) {
          this.memoryCachedPolls = cachedPolls as Array<Poll>
          return cachedPolls as Poll[]
        }
        return []
      }
      case 'remote': {
        const polls = await this.apiService.getPolls()
        await this.cacheManager.setInCache(cacheKey, polls)
        this.memoryCachedPolls = polls
        return polls
      }
    }
  }

  public async getPoll(pollId: string): Promise<Poll> {
    const cachedPoll = this.memoryCachedPolls.find((item) => item.uuid === pollId)
    if (cachedPoll) {
      return cachedPoll
    }

    // If no cache, fetch again to find matching poll
    const polls = await this.getPolls()
    const poll = polls.find((item) => item.uuid === pollId)
    if (poll) {
      return poll
    } else {
      throw new Error(`Poll with id ${pollId} does not exists`)
    }
  }

  public async sendPollAnswers(poll: Poll, result: PollResult, location: Location | null): Promise<void> {
    const restResponse = RestPollResultRequestMapper.map(poll, result, location)
    await this.apiService.sendPollAnswers(restResponse)
  }

  public static getInstance(): PollsRepository {
    if (!PollsRepository.instance) {
      PollsRepository.instance = new PollsRepository()
    }
    return PollsRepository.instance
  }
}

export default PollsRepository
