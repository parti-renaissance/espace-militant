import { StepType } from '../../../core/entities/StepType'
import { PollDetailComponentProvider } from './PollDetailComponentProvider'

export class CompoundPollDetailComponentProvider<A, B>
  implements PollDetailComponentProvider<A & B>
{
  private lhs: PollDetailComponentProvider<A>
  private rhs: PollDetailComponentProvider<B>

  constructor(
    lhs: PollDetailComponentProvider<A>,
    rhs: PollDetailComponentProvider<B>,
  ) {
    this.lhs = lhs
    this.rhs = rhs
  }

  getStepComponent(step: number): JSX.Element {
    const { provider, relativeStep } = this.getRelativeData(step)
    return provider.getStepComponent(relativeStep)
  }

  getNumberOfSteps(): number {
    return this.lhs.getNumberOfSteps() + this.rhs.getNumberOfSteps()
  }

  getStepType(step: number): StepType {
    const { provider, relativeStep } = this.getRelativeData(step)
    return provider.getStepType(relativeStep)
  }

  isDataComplete(step: number): boolean {
    const { provider, relativeStep } = this.getRelativeData(step)
    return provider.isDataComplete(relativeStep)
  }

  getResult(): A & B {
    const lhsResult = this.lhs.getResult()
    const rhsResult = this.rhs.getResult()
    return {
      ...lhsResult,
      ...rhsResult,
    }
  }

  private getRelativeData(step: number): {
    provider: PollDetailComponentProvider<Partial<A>>
    relativeStep: number
  } {
    if (step < this.lhs.getNumberOfSteps()) {
      return { provider: this.lhs, relativeStep: step }
    } else {
      return {
        // TODO: fix type - rhs is a different provider implementation type
        // @ts-expect-error - provider union type does not include rhs type
        provider: this.rhs,
        relativeStep: step - this.lhs.getNumberOfSteps(),
      }
    }
  }
}
