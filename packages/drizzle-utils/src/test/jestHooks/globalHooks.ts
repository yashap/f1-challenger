import { TestDb } from '../TestDb'

beforeAll(async () => {
  await TestDb.init()
  await TestDb.clear()
})

afterEach(async () => {
  await TestDb.clear()
})
