import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Comments } from "components/Comments/Comments";
import CreateComment from "components/Comments/CreateComment";
import React from "react";
import { EditDeletePostBtns } from "../../components/Posts/EditDeletePostBtns";
import { Layout } from "../../components/Layout";
import { useGetPostFromUrl } from "../../utils/useGetPostfromUrl";
import { format } from "timeago.js";
import { UpvoteSection } from "components/Posts/UpvoteSection";
import IPFSImage from "components/Posts/IPFSImage";
import withApollo from "utils/withApollo";

const Post = () => {
  const { data, error, loading } = useGetPostFromUrl();

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" mt={10} minHeight="20">
          <Text color="white">loading</Text>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Flex width="100%" m="auto" mt={10} justifyContent="center">
          <Heading>hmm... we couldn't find that post</Heading>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout variant={"regular"}>
      <Flex direction="column" width="92%" justifyContent="center" mx="auto">
        <Flex
          p={5}
          mt="0"
          shadow="md"
          borderWidth="1px"
          width="100%"
          flexDirection="column"
          justifyContent="space-between"
          bgColor="blackAlpha.600"
          borderBottomRadius="30px"
          borderColor="pink.200"
          borderTop="none"
          minH="xs"
        >
          <Flex
            direction={["column-reverse", "row"]}
            justifyContent="space-between"
          >
            <Flex direction="column" mt={4} mr={[0, 8]}>
              <Heading
                mb={4}
                color="white"
                fontSize={["medium", "large", "x-large"]}
              >
                {data.post.title}
              </Heading>
              <Box ml=".15rem">
                <Heading
                  mb={4}
                  color="white"
                  fontSize={["small", "medium", "large"]}
                >
                  {data.post.creator.username}
                </Heading>
              </Box>
              <Flex
                justifyContent="space-between"
                mt="3"
                ml=".15rem"
                width="100%"
                direction="column"
                height="60%"
              >
                <Flex align="left" width="100%">
                  <Text color="white" mr={2} fontSize={["xs", "sm", "md"]}>
                    {data.post.text}
                  </Text>
                </Flex>
                <Flex align="left" width="100%">
                  <Link href={data.post.audioFileName}>
                    <Text color="lightskyblue" mr={4} fontSize={["xs", "sm", "md"]}>
                      audio CID
                    </Text>
                  </Link>
                  <Link href={data.post.imageFileName}>
                    <Text color="lightskyblue" mr={4} fontSize={["xs", "sm", "md"]}>
                      image CID
                    </Text>
                  </Link>
                </Flex>
              </Flex>
              <Flex
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                mt={4}
              >
                <UpvoteSection
                  post={data.post}
                  variant="30px"
                  fontVariant="20px"
                />
                <Flex alignItems="center" mx={12}>
                  <EditDeletePostBtns
                    id={data.post.id}
                    creatorId={data.post.creator.id}
                  />
                  <Text
                    color="white"
                    fontSize={["xx-small", "xs", "sm"]}
                    mr={2}
                  >
                    {format(data.post.createdAt)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex direction="row" alignItems="center" justifyContent="center">
              {data.post.imageFileName ? <IPFSImage post={data.post} /> : null}
            </Flex>
          </Flex>
        </Flex>
        <CreateComment postId={data.post.id} />
        <Comments postId={data.post.id} />
      </Flex>
    </Layout>
  );
};

export default withApollo(Post);
