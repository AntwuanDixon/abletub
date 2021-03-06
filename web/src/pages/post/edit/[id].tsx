import { Box, Button, Flex } from "@chakra-ui/react";
import { Wrapper } from "components/Wrapper";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import withApollo from "utils/withApollo";
import { InputField } from "../../../components/FormFields/InputField";
import { Layout } from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const pause = intId === -1;
  const { data, loading } = usePostQuery({
    skip: pause,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>We couldn't find that post...</Box>
      </Layout>
    );
  }

  return (
    <Wrapper>
      <Flex w="100%" justifyContent="center">
        <Box
          mt={0}
          width="30rem"
          display="flex"
          justifyContent="center"
          p={10}
          shadow="md"
          borderWidth="1px"
          flexDirection="row"
          bgColor="blackAlpha.400"
          borderBottomRadius="30px"
          borderColor="pink.200"
          borderTop="none"
        >
          <Formik
            initialValues={{ title: data.post.title, text: data.post.text }}
            onSubmit={async (values) => {
              await updatePost({variables: { id: intId, ...values }});
              router.back();
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{width:"90%"}}>
                <InputField
                  size={""}
                  textarea={false}
                  name="title"
                  placeholder="title"
                  label="Title"
                />
                <Box mt={4}>
                  <InputField
                    size={""}
                    textarea
                    name="text"
                    placeholder="text..."
                    label="Body"
                  />
                </Box>
                <Flex justifyContent="center">
                  <Button
                    mt={4}
                    type="submit"
                    isLoading={isSubmitting}
                    colorScheme="pink"
                  >
                    update post
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Wrapper>
  );
};

export default withApollo(EditPost);
