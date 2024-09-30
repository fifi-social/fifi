import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import styled, { keyframes } from "styled-components";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Animate from '../Components/Animate';
import Spinner from '../Components/Spinner';
import { useUser } from '../context/userContext';
import Levels from '../Components/Levels';
import flash from "../images/flash.webp";
import coinsmall from "../images/coinsmall.webp";




const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none; /* To prevent any interaction */
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Plutos = () => {

  console.log("process.env.REACT_APP_API_KEY", process.env.REACT_APP_API_KEY)

  const imageRef = useRef(null);
  const [clicks, setClicks] = useState([]);
  const { balance, tapBalance, energy, battery, tapGuru, mainTap, setIsRefilling, refillIntervalRef, refillEnergy, setEnergy, tapValue, setTapBalance, setBalance, refBonus, level, loading } = useUser();

  // eslint-disable-next-line
  const [points, setPoints] = useState(0);
    // eslint-disable-next-line
  const [isDisabled, setIsDisabled] = useState(false);
    // eslint-disable-next-line
  const [openClaim, setOpenClaim] = useState(false);
  // eslint-disable-next-line
  const [congrats, setCongrats] = useState(false);
    // eslint-disable-next-line
  const [glowBooster, setGlowBooster] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const debounceTimerRef = useRef(null);
    // eslint-disable-next-line
  const refillTimerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const accumulatedBalanceRef = useRef(balance);
  const accumulatedEnergyRef = useRef(energy);
  const accumulatedTapBalanceRef = useRef(tapBalance);
  const refillTimeoutRef = useRef(null); // Add this line


  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    if (isIOS && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } else if (isAndroid && 'vibrate' in navigator) {
      // Use the vibration API on Android
      navigator.vibrate(50); // Vibrate for 50ms
    } else {
      console.warn('Haptic feedback not supported on this device.');
    }
  }




  const handleClick = (e) => {
    triggerHapticFeedback();

    if (energy <= 0 || isDisabled || isUpdatingRef.current) {
      setGlowBooster(true); // Trigger glow effect if energy and points are 0
      setTimeout(() => {
        setGlowBooster(false); // Remove glow effect after 1 second
      }, 300);
      return; // Exit if no energy left or if clicks are disabled or if an update is in progress
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? 'wobble-left'
        : offsetX > horizontalMidpoint
        ? 'wobble-right'
        : offsetY < verticalMidpoint
        ? 'wobble-top'
        : 'wobble-bottom';

    // Remove previous animations
    imageRef.current.classList.remove(
      'wobble-top',
      'wobble-bottom',
      'wobble-left',
      'wobble-right'
    );

    // Add the new animation class
    imageRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends to allow re-animation on the same side
    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500); // duration should match the animation duration in CSS

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setClicks((prevClicks) => [...prevClicks, newClick]);

    // Update state immediately for UI
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - tapValue.value, 0); // Ensure energy does not drop below zero
      accumulatedEnergyRef.current = newEnergy;
      return newEnergy;
    });

    setPoints((prevPoints) => prevPoints + tapValue.value);

    setBalance((prevBalance) => {
      const newBalance = prevBalance + tapValue.value;
      accumulatedBalanceRef.current = newBalance;
      return newBalance;
    });

    setTapBalance((prevTapBalance) => {
      const newTapBalance = prevTapBalance + tapValue.value;
      accumulatedTapBalanceRef.current = newTapBalance;
      return newTapBalance;
    });

    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000); // Match this duration with the animation duration

    // Reset the debounce timer
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(updateFirestore, 1000); // Adjust the delay as needed

  // Reset the refill timer
  clearInterval(refillIntervalRef.current); // Stop refilling while the user is active
  setIsRefilling(false); // Set refilling state to false
  clearTimeout(refillTimeoutRef.current);
  refillTimeoutRef.current = setTimeout(() => {
    if (energy < battery.energy) {
      refillEnergy();
    }
  }, 1000); // Set the inactivity period to 3 seconds (adjust as needed)
};
  const handleClickGuru = (e) => {
    triggerHapticFeedback();

    if (energy <= 0 || isDisabled || isUpdatingRef.current) {
      setGlowBooster(true); // Trigger glow effect if energy and points are 0
      setTimeout(() => {
        setGlowBooster(false); // Remove glow effect after 1 second
      }, 300);
      return; // Exit if no energy left or if clicks are disabled or if an update is in progress
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? 'wobble-left'
        : offsetX > horizontalMidpoint
        ? 'wobble-right'
        : offsetY < verticalMidpoint
        ? 'wobble-top'
        : 'wobble-bottom';

    // Remove previous animations
    imageRef.current.classList.remove(
      'wobble-top',
      'wobble-bottom',
      'wobble-left',
      'wobble-right'
    );

    // Add the new animation class
    imageRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends to allow re-animation on the same side
    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500); // duration should match the animation duration in CSS

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setClicks((prevClicks) => [...prevClicks, newClick]);

    // Update state immediately for UI
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - 0, 0); // Ensure energy does not drop below zero
      accumulatedEnergyRef.current = newEnergy;
      return newEnergy;
    });

    setPoints((prevPoints) => prevPoints + tapValue.value * 5);

    setBalance((prevBalance) => {
      const newBalance = prevBalance + tapValue.value * 5;
      accumulatedBalanceRef.current = newBalance;
      return newBalance;
    });

    setTapBalance((prevTapBalance) => {
      const newTapBalance = prevTapBalance + tapValue.value * 5;
      accumulatedTapBalanceRef.current = newTapBalance;
      return newTapBalance;
    });

    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000); // Match this duration with the animation duration


    // Reset the debounce timer
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(updateFirestore, 1000); // Adjust the delay as needed

  // Reset the refill timer
  clearInterval(refillIntervalRef.current); // Stop refilling while the user is active
  setIsRefilling(false); // Set refilling state to false
  clearTimeout(refillTimeoutRef.current);
  refillTimeoutRef.current = setTimeout(() => {
    if (energy < battery.energy) {
      refillEnergy();
    }
  }, 1000); // Set the inactivity period to 3 seconds (adjust as needed)
};

  const updateFirestore = async () => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());

      // Set updating flag
      isUpdatingRef.current = true;

      try {
        await updateDoc(userRef, {
          balance: accumulatedBalanceRef.current,
          energy: accumulatedEnergyRef.current,
          tapBalance: accumulatedTapBalanceRef.current,
        });

        // No need to update state here as it is already updated immediately in handleClick

        // Reset accumulated values to current state values
        accumulatedBalanceRef.current = balance;
        accumulatedEnergyRef.current = energy;
        accumulatedTapBalanceRef.current = tapBalance;
      } catch (error) {
        console.error('Error updating balance and energy:', error);
      } finally {
        // Clear updating flag
        isUpdatingRef.current = false;
      }
    }
  };


  
  const energyPercentage = (energy / battery.energy) * 100;


  // const handleClaim = async () => {
  //   const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  //   if (telegramUser) {
  //     const { id: userId } = telegramUser;
  //     const userRef = doc(db, 'telegramUsers', userId.toString());
  //     try {
  //       await updateDoc(userRef, {
  //         balance: balance + points,
  //         energy: energy,
  //         tapBalance: tapBalance + points
     
  //       });
  //       setBalance((prevBalance) => prevBalance + points);
  //       setTapBalance((prevTapBalance) => prevTapBalance + points);
  //       localStorage.setItem('energy', energy);

  //       if (energy <= 0) {
  //         setIsTimerVisible(true);
  //       }
  //       console.log('Points claimed successfully');
  //     } catch (error) {
  //       console.error('Error updating balance and energy:', error);
  //     }
  //   }
  //   openClaimer();
  // };



  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

      // // Remove the click after the animation duration
      // setTimeout(() => {
      //   setTapGuru(false);
      //   setMainTap(true);
      // }, 22000); // Match this duration with the animation duration
  

      

  return (
<>
      {loading ? (
        <Spinner />
      ) : (
  
        <Animate>
         <div className="flex flex-col justify-center w-full overflow-hidden">
          <div className="flex space-x-[2px] justify-center items-center">
            <div className="w-[50px] h-[50px]">
              <img src={coinsmall} className="w-full" alt="coin" />
            </div>
            <h1 className="text-[#fff] text-[42px] font-extrabold">
            {formatNumber(balance + refBonus)} <br/>
          
            </h1>
          </div>
      
          <div
          
            className="w-full ml-[6px] flex space-x-1 items-center justify-center"
          >
            <img
              src={level.imgUrl}
              className="w-[25px] relative"
              alt="bronze"
            />
            <h2 onClick={() => setShowLevels(true)}className="text-[#9d99a9] text-[20px] font-medium">
            {level.name}
            </h2>
            <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
          </div>
          <div className="relative flex items-center justify-center w-full pb-24 pt-7">

          <div className="bg-[#efc26999] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] top-10 -left-40 rounded-full"></div>
          <div class={`${tapGuru ? 'block' : 'hidden'} pyro`}>
  <div class="before"></div>
  <div class="after"></div>
</div>
            <div className="w-[350px] h-[350px] relative flex items-center justify-center">
            <img src='/lihgt.webp'
                alt='err' className={`absolute w-[330px] rotate-45 ${tapGuru ? 'block' : 'hidden'}`}/>

              <div className="image-container">
             {mainTap && (
              <Container>
                  <img
                    onPointerDown={handleClick}
                    ref={imageRef}
                    src='/bcen.png'
                    alt="Wobble"
                    className="wobble-image !w-[250px] select-none"
                  />
                  {clicks.map((click) => (
                    <SlideUpText key={click.id} x={click.x} y={click.y}>
                      +{tapValue.value}
                    </SlideUpText>
                  ))}
                </Container>
             )}   
             {tapGuru && (
              <Container>

                  <img
                    onPointerDown={handleClickGuru}
                    ref={imageRef}
                    src='/bcen.png'
                    alt="Wobble"
                    className="wobble-image !w-[250px] select-none"
                  />
                  {clicks.map((click) => (
                    <SlideUpText key={click.id} x={click.x} y={click.y}>
                      +{tapValue.value * 5}
                    </SlideUpText>
                  ))}
                </Container>
             )}   
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
                <img alt="flash" src={flash} className="w-[20px]" />
                <div className="">
                  <span className="text-[18px] font-bold">{energy.toFixed(0)}</span>
                  <span className="text-[14px] font-medium">/ {battery.energy}</span>
                </div>
              </div>
              <div className="flex w-full p-[4px] h-[20px] items-center bg-energybar rounded-[12px] border-[1px] border-borders2">
              <div
          className="bg-[#e39725] h-full rounded-full transition-width duration-100"
          style={{ width: `${energyPercentage}%` }}
        ></div>
              </div>
            </div>
          </div>
          <Levels showLevels={showLevels} setShowLevels={setShowLevels} />






          </div>
        </Animate>
      )}
</>
  );
};


export default Plutos;
