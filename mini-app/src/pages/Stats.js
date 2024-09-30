import React from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import coinsmall from "../images/coinsmall.webp";
import { useUser } from "../context/userContext";

const Stats = () => {
  // eslint-disable-next-line
const { totalCount, dividedCount, users, dividedUsers } = useUser();


  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ") + " K";
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const formattedUsers = new Intl.NumberFormat()
    .format(users)
    .replace(/,/g, " ");

  const formattedDividedUsers = new Intl.NumberFormat()
    .format(dividedUsers)
    .replace(/,/g, " ");

  return (
    <>

        <Animate>
          <div className="w-full justify-center flex-col space-y-3 px-5">
            <div className="fixed top-0 left-0 right-0 pt-8 px-5">
              <div className="w-full items-center justify-center pb-3 flex pt-2">
                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                  Total Share balance
                </h2>
              </div>
              <div className="flex space-x-1 ml-[-8px] justify-center items-center">
                <div className="w-[50px] h-[50px]">
                  <img src={coinsmall} className="w-full" alt="coin" />
                </div>
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                  {formatNumber(totalCount)}
                </h1>
              </div>

              <div className="bg-[#362c4d] w-full px-5 h-[1px] !mt-5 !mb-5"></div>

              <div className="w-full items-center flex flex-col space-y-2">
                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Total Touches:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formatNumber(dividedCount)}
                  </span>
                </h3>

                {/*  */}

                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Total Players:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formattedUsers}
                  </span>
                </h3>

                {/*  */}

                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Daily Users:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formattedDividedUsers}
                  </span>
                </h3>

                {/*  */}

                <h3 className="text-[16px] text-[#9d99a9] items-center font-semibold pb-4 flex flex-col">
                  <span> Online Players:</span>
                  <span className="text-[#fff] font-semibold text-[24px]">
                    {formattedDividedUsers}
                  </span>
                </h3>

                {/*  */}
              </div>
            </div>
          </div>
          <Outlet />
        </Animate>
 
    </>
  );
};

export default Stats;
