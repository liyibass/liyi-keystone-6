import { createSchema } from '@keystone-next/keystone'
import User from './lists/User'
import Post from './lists/Post'

export const lists = createSchema({
    User,
    Post,
})
