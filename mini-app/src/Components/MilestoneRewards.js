import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircle} from 'react-icons/io5';
import congratspic from "../images/celebrate.gif";
import coinsmall from "../images/coinsmall.webp";

const milestones = [
  { name: 'Bronze', icon: 'https://ucarecdn.com/074dadcb-6be1-47e7-92da-28d2bd3a9448/bronze.webp', tapBalanceRequired: 1000, reward: 50000 },
  { name: 'Silver', icon: 'https://ucarecdn.com/6725a762-528a-4967-bde1-f4da9f4833ee/sliver.webp', tapBalanceRequired: 50000, reward: 100000 },
  { name: 'Gold', icon: 'https://ucarecdn.com/06204717-97e6-4e54-86b7-6b17a6b59788/gold.webp', tapBalanceRequired: 500000, reward: 250000 },
 ];

const MilestoneRewards = () => {
  const { tapBalance, balance, setBalance, id, claimedMilestones, setClaimedMilestones } = useUser();
  const [congrats, setCongrats] = useState(false)

  const handleClaim = async (milestone) => {
    if (tapBalance >= milestone.tapBalanceRequired && !claimedMilestones.includes(milestone.name)) {
      const newBalance = balance + milestone.reward;
      try {
        const userRef = doc(db, 'telegramUsers', id);
        await updateDoc(userRef, {
          balance: newBalance,
          claimedMilestones: [...claimedMilestones, milestone.name],
        });
        setBalance(newBalance);
        setClaimedMilestones([...claimedMilestones, milestone.name]);
        setCongrats(true)
  
        setTimeout(() => {
            setCongrats(false)
        }, 4000)
      } catch (error) {
        console.error('Error claiming milestone reward:', error);
      }
    } else {
      console.error('Already Claimed:');
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

  return (
    <div className="w-full flex flex-col space-y-4">

      {milestones.filter(milestone => !claimedMilestones.includes(milestone.name)).map((milestone) => {
        const progress = (tapBalance / milestone.tapBalanceRequired) * 100;
        const isClaimable = tapBalance >= milestone.tapBalanceRequired && !claimedMilestones.includes(milestone.name);
        return (

            <>
            <div key={milestone.name} className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>

<div className='flex flex-1 items-center space-x-2'>

    <div className=''>
        <img src={milestone.icon} alt="bronze" className='w-[55px]'/>
    </div>
    <div className='flex flex-col space-y-1'>
        <span className='font-semibold'>
        {milestone.name}
        </span>
        <div className='flex items-center space-x-1'>
        <span className="w-[20px] h-[20px]">
<img src={coinsmall} className="w-full" alt="coin"/>
</span>
<span className='font-medium'>
{formatNumberCliam(milestone.reward)}
</span>
        </div>
    </div>

</div>

{/*  */}

<div className=''>
<button
 disabled={!isClaimable}
 onClick={() => handleClaim(milestone)}
  className={` ${isClaimable ? 'bg-btn text-white' : "bg-btn2 text-[#fff6]"} relative rounded-[8px] font-semibold py-2 px-3`}>
 {isClaimable ? 'Claim' : 'Claim'}
</button>


</div>


<div className='flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders'>


    
     <div className={`h-[8px] rounded-[8px] ${progress >= 100 ? 'bg-btn' : 'bg-btn'}`} style={{ width: `${progress > 100 ? 100 : progress}%` }}> 
     </div>

   




</div>

</div>
{/*  */}

            </>


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
  );
};

export default MilestoneRewards;
