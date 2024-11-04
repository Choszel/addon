import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

const QuizCardSkeleton = () => {
  return (
    <Card>
      <Skeleton
        height="200px"
        className="primary_style"
        startColor="var(--primary)"
        endColor="var(--secondary)"
      />
      <CardBody className="basic_style">
        <SkeletonText className="basic_style"></SkeletonText>
      </CardBody>
    </Card>
  );
};

export default QuizCardSkeleton;
