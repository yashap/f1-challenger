import { AuthGuard } from 'src/auth'
import { TestDbTeardown } from 'src/test/TestDbTeardown'

beforeAll(async () => {
  await new TestDbTeardown().clear()
  AuthGuard.mock()
})

afterEach(async () => {
  await new TestDbTeardown().clear()
})

afterAll(async () => {
  AuthGuard.unMock()
})
