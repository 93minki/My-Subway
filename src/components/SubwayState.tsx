import subwayInfo from "../subway_info.json";

const SubwayState = () => {
  console.log("subwayInfo", subwayInfo[1007].color);
  return (
    <div className="flex min-w-[680px] m-auto justify-center items-center">
      <div
        className={`bg-1007 w-[100px] h-12 flex justify-center items-center`}
      >
        prev
      </div>
      <div
        className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-1007 `}
      >
        current
      </div>
      <div
        className={`bg-1007 w-[100px] h-12 flex justify-center items-center `}
      >
        next
      </div>
    </div>
  );
};

export default SubwayState;
