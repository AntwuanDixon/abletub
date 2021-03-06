import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link';
import { useDeletePostMutation, useMeQuery } from '../../generated/graphql';
import router from 'next/router';

interface EditDeletePostBtnsProps {
    id: number;
    creatorId: number
}

export const EditDeletePostBtns: React.FC<EditDeletePostBtnsProps> = ({
    id,
    creatorId
}) => {
    const [deletePost] = useDeletePostMutation()
    const {data: userData} = useMeQuery()
    if (userData?.me?.id !== creatorId) {
        return null;
    }
    return (
        <Flex direction="row" mx={4}>
            <Box mr={2}>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton
                as={Link}
                aria-label="edit post"
                height={["8", "8", "12"]}
                icon={<EditIcon/>}
                />
            </NextLink>
            </Box>
            <Box mr={2}>
            <IconButton
                aria-label="delete post"
                icon={<DeleteIcon/>}
                height={["8", "8", "12"]}
                onClick={async () => {
                    deletePost({ variables: {id}, update:(cache) => {
                        cache.evict({id: 'Post:' + id})
                    } })
                    router.push('/');
                }}
                ml="auto"
            />
            </Box>
        </Flex>
    )
}
