import { ChangeEvent, useEffect, useState } from "react";
import Comments from "../Comments";
import { useRouter } from "next/router";
import { createComment, findComments } from "@/lib/services/comments";
import { CommentServiceDto, FindCommentsResponseDto } from "@/lib/services/comments/schema";
import Button from "@/components/common/Button/Button";

interface CommentInputProps {
  cardId: number;
  columnId: number;
}

function CommentInput({ cardId, columnId }: CommentInputProps) {
  const [comment, setComment] = useState<string>("");
  const [commentList, setCommentList] = useState<CommentServiceDto[]>([]);
  const {
    query: { id },
  } = useRouter();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (comment.trim() !== "") {
      const form = {
        content: comment,
        cardId,
        columnId,
        dashboardId: Number(id),
      };
      try {
        const response = await createComment(form);
        console.log("comment", response);
        setComment("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = (id: number) => {
    console.log(id);
    const updatedComments = commentList.filter((_, index) => index !== id);
    setCommentList(updatedComments);
  };

  useEffect(() => {
    const fetch = async () => {
      const qs = {
        cardId,
      };
      try {
        const response = (await findComments(qs)).data as FindCommentsResponseDto;
        if (response) {
          setCommentList(response.comments);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [cardId, handleSubmit]);

  return (
    <>
      <div className="relative flex flex-col w-full gap-5">
        <label className="text-xl font-medium leading-normal font-Pretendard">댓글</label>
        <div className="w-full p-16 font-normal leading-normal outline-none text-12 tablet:text-14 border-1 h-70 tablet:h-110 rounded-6 border-gray-D9D9 focus-within:border-violet placeholder:text-gray-9FA6 font-Pretendard">
          <textarea
            className="h-full outline-none resize-none w-200 tablet:w-330 text-12"
            placeholder="댓글 작성하기"
            value={comment}
            onChange={handleChange}></textarea>
        </div>
        <div className="absolute bottom-15 right-15">
          <Button variant="ghost" buttonType="comment" onClick={handleSubmit}>
            입력
          </Button>
        </div>
      </div>
      {commentList && commentList.length > 0 && (
        <div className="overflow-auto max-h-150 w-320 tablet:w-470">
          {commentList.map((comment, index) => (
            <Comments key={index} comment={comment} onDelete={() => handleDelete(comment.id)} />
          ))}
        </div>
      )}
    </>
  );
}

export default CommentInput;
