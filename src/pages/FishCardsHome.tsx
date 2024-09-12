import useTokenData from "../others/useTokenData";

const FishCardsHome = () => {
  const { CheckUserType, GetUserId } = useTokenData();
  return (
    <>
      <p>{CheckUserType()}</p>
      <p>{GetUserId()}</p>
    </>
  );
};

export default FishCardsHome;
