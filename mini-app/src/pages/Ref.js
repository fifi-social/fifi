import React, { useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import ClaimLeveler from "../Components/ClaimLeveler";
import Spinner from "../Components/Spinner";
import coinsmall from "../images/coinsmall.webp";
import { useUser } from "../context/userContext";


const Ref = () => {
  const { id, referrals, loading } = useUser();
  // eslint-disable-next-line
  const [claimLevel, setClaimLevel] = useState(false);
  const [copied, setCopied] = useState(false);

 
  const copyToClipboard = () => {

   const reflink = `https://t.me/bicento_tap_bot?start=r${id}`

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reflink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 10000); // Reset the copied state after 2 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      } catch (err) {
        console.error('Failed to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };


  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };


  return (
        <>
           
        {loading ? ( // Display loading indicator if data is fetching
        <Spinner/>
      ) : (
    <>

      <Animate>
        <div className="flex-col justify-center w-full px-5 space-y-3">
          <div className="flex flex-col items-center justify-center space-y-0">
            <h1 className="text-[#fff] -mb-2 text-[42px] font-semibold">
            {referrals.length} Users
            </h1>
            <span className="text-[#6ed86e] font-semibold text-[16px]">
              {/* + 0 */}
            </span>
          </div>

          <div className="w-full bg-cards rounded-[12px] px-3 py-4 flex flex-col">
            <span className="flex items-center justify-between w-full pb-2">
              <h2 className="text-[18px] font-semibold">My invite link:</h2>
              <span
                onClick={copyToClipboard}
                className="bg-gradient-to-b from-[#094e9d] to-[#0b62c4] font-medium py-[6px] px-4 rounded-[12px] flex items-center justify-center text-[16px]"
              >
              {copied ? <span>Copied!</span> : <span>Copy</span>}
              </span>
            </span>
            <div className="text-[#9a96a6] text-[13px]">
            https://t.me/bicento_tap_bot?start=r{id}
            </div>
          </div>
          <div className="bg-borders w-full px-5 h-[1px] !mt-6"></div>

          <div className="flex flex-col w-full">
            <h3 className="text-[22px] font-semibold pb-[16px]">My Referrals:</h3>

            <div className="flex flex-col w-full space-y-3">

            {loading ? (
        <p className='w-full text-center'>checking...</p>
      ) : referrals.length === 0 ? (
        <p className='text-center w-full now pt-8 px-5 text-[14px] leading-[24px]'>
         You don't have referrals😭
          </p>
      ) : (
        <>


        
                            {referrals.map((user, index) => (

                              <>

<div
                      key={index}
                      className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center"
                    >
                      <div className="flex flex-col flex-1 space-y-1">
                        <div className="text-[#fff] pl-1 text-[16px] font-semibold">
                        {user.username}
                        </div>

                        <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
                          <div className="">
                            <img src={user.level.imgUrl} alt="bronze" className="w-[18px]" />
                          </div>
                          <span className="font-medium text-[#9a96a6]">
                          {user.level.name}
                          </span>
                          <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>

                          <span className="w-[20px]">
                            <img
                              src={coinsmall}
                              className="w-full"
                              alt="coin"
                            />
                          </span>
                          <span className="font-normal text-[#ffffff] text-[15px]">
                          {formatNumber(user.balance)}
                          </span>
                        </div>
                      </div>

                      <div className="text-[#ffce68] font-semibold text-[14px]">
                      +{formatNumber(user.balance / 100 * 10)}
                      </div>
                      <div className="flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders">
                        <div className="h-[10px] rounded-[8px] bg-btn w-[.5%]"></div>
                      </div>
                    </div>

                    </>
                  ))}
</>
                )}

            </div>
          </div>

          <ClaimLeveler claimLevel={claimLevel} setClaimLevel={setClaimLevel} />
        </div>
        <Outlet />
      </Animate>
    </>
      )}
    
    </>
    
  );
};

export default Ref;
