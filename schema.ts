import { createSchema } from '@keystone-next/keystone'
import User from './lists/User'
import Post from './lists/Post'
import Image from './lists/Image'
import CustomFieldList from './lists/CustomFieldList'

export const lists = createSchema({
    User,
    Post,
    Image,
    CustomFieldList,
})
