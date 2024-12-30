import { FooRepository } from '../FooApp'

afterEach(() => {
  FooRepository.clear()
})
