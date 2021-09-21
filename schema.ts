import { createSchema } from '@keystone-next/keystone'
import User from './lists/User'
import Post from './lists/Post'
import CustomFieldList from './lists/CustomFieldList'

export const lists = createSchema({
    User,
    Post,
    CustomFieldList,
})
