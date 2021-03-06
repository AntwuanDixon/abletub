import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Query,
  Resolver,
  Mutation,
  InputType,
  Field,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Comment } from "../entities/Comment";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { User } from "../entities/User";

@InputType()
class CommentInput {
  @Field()
  text!: string;
}

@ObjectType()
class PaginatedComments {
  @Field(() => [Comment])
  comments?: Comment[];
  @Field()
  hasMore?: boolean;
}

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.creatorId);
  }

  @Query(() => Comment, { nullable: true })
  async comment(@Arg("id") id: number): Promise<Comment | undefined> {
    return Comment.findOne(id);
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("input") input: CommentInput,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    const newComment = await Comment.create({
      ...input,
      creatorId: req.session.userId,
      postId,
    }).save();

    return newComment;
  }

  @Query(() => PaginatedComments)
  async comments(
    @Arg("postId", () => Int) postId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedComments> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne];

    const comments = await getConnection().query(
      `
        select c.*
        from comment c
        where c."postId" = ${postId}
        ${cursor ? `order by c."createdAt" ${cursor}` : ''}
        limit $1
        `,
      replacements
    );

    return {
      comments: comments.slice(0, realLimit),
      hasMore: comments.length === realLimitPlusOne,
    };
  }
}
