import React, { useEffect, useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircle } from 'react-icons/io5';
import congratspic from "../images/celebrate.gif";
import Animate from '../Components/Animate';
import ref from "../images/ref.webp";
import coinsmall from "../images/coinsmall.webp";

const friendsRewards = [
  { title: 'Invite 3 friends', referralsRequired: 2, bonusAward: 50000 },
  { title: 'Invite 5 friends', referralsRequired: 5, bonusAward: 150000 },
  { title: 'Invite 10 friends', referralsRequired: 10, bonusAward: 250000 },
];

const ReferralRewards = () => {
  const { referrals, balance, setBalance, id, claimedReferralRewards, setClaimedReferralRewards } = useUser();
  const [congrats, setCongrats] = useState(false);


  const handleClaim = async (reward) => {
    if (referrals.length >= reward.referralsRequired && !claimedReferralRewards.includes(reward.title)) {
      const newBalance = balance + reward.bonusAward;
      try {
        const userRef = doc(db, 'telegramUsers', id);
        await updateDoc(userRef, {
          balance: newBalance,
          claimedReferralRewards: [...claimedReferralRewards, reward.title],
        });
        setBalance(newBalance);
        setClaimedReferralRewards([...claimedReferralRewards, reward.title]);
    
        setCongrats(true);

        setTimeout(() => {
          setCongrats(false);
        }, 4000);
      } catch (error) {
        console.error('Error claiming referral reward:', error);
      }
    } else {
      console.error('Already Claimed');
    }
  };

    const formatNumberCliam = (num) => {
        if (num < 100000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 1000000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 10000000) {
            return new Intl.NumberFormat().format(num).replace(/,/g, " ");
          } else {
          return (num / 10000000).toFixed(3).replace(".", ".") + " T";
        }
      };


  useEffect(() => {
 
    // Show the back button when the component mounts
    window.Telegram.WebApp.BackButton.show();

    // Attach a click event listener to handle the back navigation
    const handleBackButtonClick = () => {
      window.history.back();
    };

    window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);

    // Clean up the event listener and hide the back button when the component unmounts
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
      window.Telegram.WebApp.BackButton.hide();
    };

  }, []);




  return (
    <Animate>

<div className="w-full flex flex-col space-y-4">

      {friendsRewards
        .filter((reward) => !claimedReferralRewards.includes(reward.title))
        .map((reward) => {
          const progress = (referrals.length / reward.referralsRequired) * 100;
          const isClaimable = referrals.length >= reward.referralsRequired && !claimedReferralRewards.includes(reward.title);
          return (
            <div key={reward.title} className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

<div className='flex flex-1 items-center space-x-2'>

    <div className=''>
        <img src={ref}alt="bronze" className='w-[55px]'/>
    </div>
    <div className='flex flex-col space-y-1'>
        <span className='font-semibold'>
        {reward.title}
        </span>
        <div className='flex items-center space-x-1'>
        <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
{formatNumberCliam(reward.bonusAward)}
</span>
        </div>
    </div>

</div>

{/*  */}

<div className=''>
<button
 disabled={!isClaimable}
 onClick={() => handleClaim(reward)}
  className={` ${isClaimable ? 'bg-btn text-white' : "bg-btn2 text-[#fff6]"} relative rounded-[8px] font-semibold py-2 px-3`}>
 {isClaimable ? 'Claim' : 'Claim'}
</button>


</div>


<div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>


    
     <div className={`h-[8px] rounded-[8px] ${progress >= 100 ? 'bg-btn' : 'bg-btn'}`} style={{ width: `${progress > 100 ? 100 : progress}%` }}> 
     </div>

   




</div>

</div>
          );
        })}


<div className="w-full absolute top-[-35px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none">
        {congrats ? <img src={congratspic} alt="congrats" className="w-[80%]" /> : null}
      </div>

<div className={`${congrats === true ? "visible bottom-6" : "invisible bottom-[-10px]"} z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
              <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">



              <IoCheckmarkCircle size={24} className=""/>

              <span className="font-medium">
                Good
              </span>

              </div>


            </div>


    </div>



  
      </Animate>
  );
};

export default ReferralRewards;
