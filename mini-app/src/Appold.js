// import React, { useState, useEffect, useRef } from "react";
// import styled, { keyframes } from "styled-components";
// import "./App.css";
// import coinsmall from "../src/images/coinsmall.webp";
// import tapmecoin from "../src/images/tapme.webp";
// import bronze from "../src/images/bronze.webp";
// import { MdOutlineKeyboardArrowRight } from "react-icons/md";
// import { IoIosFlash } from "react-icons/io";
// import { db } from './firebase';
// import { collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';
// import Animate from "./Components/Animate";
// import Spinner from "./Components/Spinner";
// import Levels from "./Components/Levels";



// const slideUp = keyframes`
//   0% {
//     opacity: 1;
//     transform: translateY(0);
//   }
//   100% {
//     opacity: 0;
//     transform: translateY(-350px);
//   }
// `;




// const SlideUpText = styled.div`
//   position: absolute;
//   animation: ${slideUp} 3s ease-out;
//   font-size: 2.1em;
//   color: #ffffffa6;
//   font-weight: 600;
//   left: ${({ x }) => x}px;
//   top: ${({ y }) => y}px;
//   pointer-events: none; /* To prevent any interaction */
// `;

// const Container = styled.div`
//   position: relative;
//   display: inline-block;
//   text-align: center;
//   width: 100%;
//   height: 100%;
// `;


// const EnergyFill = styled.div`
//   background-color: #e39725;
//   height: 8px;
//   border-radius: 6px;
//   width: ${({ percentage }) => percentage}%;
// `;



// const refillTime = 5 * 60 * 1000; // 15 minutes in milliseconds

// function Appold() {

//   const [username, setUsername] = useState("");
//   const [idme, setIdme] = useState("");
//   const [count, setCount] = useState(0);
//   const [energy, setEnergy] = useState(500);
//   const [displayEnergy, setDisplayEnergy] = useState(500); // Added state for displaying energy
//   const imageRef = useRef(null);
//   const [showText, setShowText] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [clicks, setClicks] = useState([]);
//   const [refilling, setRefilling] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showLevels, setShowLevels] = useState(false);
//   const [fetchError, setFetchError] = useState(false); // State to track fetch error


//   const levelsAction = () => {

//     setShowLevels(true);

//     document.getElementById("footermain").style.zIndex = "50";

//   }


//   const handleClick = (e) => {
//     if (energy > 0) {
//       const { offsetX, offsetY, target } = e.nativeEvent;
//       const { clientWidth, clientHeight } = target;

//       const horizontalMidpoint = clientWidth / 2;
//       const verticalMidpoint = clientHeight / 2;

//       const animationClass =
//         offsetX < horizontalMidpoint
//           ? "wobble-left"
//           : offsetX > horizontalMidpoint
//           ? "wobble-right"
//           : offsetY < verticalMidpoint
//           ? "wobble-top"
//           : "wobble-bottom";

//       // Remove previous animations
//       imageRef.current.classList.remove(
//         "wobble-top",
//         "wobble-bottom",
//         "wobble-left",
//         "wobble-right"
//       );

//       // Add the new animation class
//       imageRef.current.classList.add(animationClass);

//       // Remove the animation class after animation ends to allow re-animation on the same side
//       setTimeout(() => {
//         imageRef.current.classList.remove(animationClass);
//       }, 1000); // duration should match the animation duration in CSS



//       // Increment the count
//       const rect = e.target.getBoundingClientRect();
//       const newClick = {
//         id: Date.now(), // Unique identifier
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top,
//       };

//         // Update count in Firestore
//         const updatedCount = count + 5; // Increment count by 5
//         localStorage.setItem('count', updatedCount); // Save updated count to local storage
      

//         setClicks((prevClicks) => [...prevClicks, newClick]);
//         setCount(updatedCount);
//         updateCountInFirestore(idme, updatedCount);

//       // Remove the click after the animation duration
//       setTimeout(() => {
//         setClicks((prevClicks) => prevClicks.filter((click) => click.id !== newClick.id));
//       }, 1000); // Match this duration with the animation duration

//       // Decrement energy
//       setEnergy((prevEnergy) => Math.max(prevEnergy - 5, 0));
//       setDisplayEnergy((prevDisplayEnergy) => Math.max(prevDisplayEnergy - 5, 0)); // Update display energy
//     } else if (energy === 0 && refilling && energy < 500) {
//       setCount(count + 5);
//       setClicks((prevClicks) => [...prevClicks, { id: Date.now() }]);
//     }
//   };

//   useEffect(() => {

//     // Fetch username from Telegram Web App context
//     const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
//     const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

//     if (telegramUsername) {
//       setUsername(telegramUsername);
//     }
//     if (telegramUserid) {
//       setIdme(telegramUserid);
//     }

//     if (telegramUsername && telegramUserid && !localStorage.getItem('userStored')) {
//       storeUserData(telegramUsername, telegramUserid);
//       localStorage.setItem('userStored', 'true');
//     }

//     const queryParams = new URLSearchParams(window.location.search);
//     const username = queryParams.get('username');

//     if (username && !localStorage.getItem('usernameStored')) {
//       storeUsername(username);
//       localStorage.setItem('usernameStored', 'true');
//     }
  

//     const interval = setInterval(() => {
//       if (energy < 500) {
//         setEnergy((prevEnergy) => {
//           const newEnergy = Math.min(prevEnergy + 5, 500);
//           setDisplayEnergy(newEnergy); // Update display energy when refilling
//           return newEnergy;
//         });
//         if (energy === 495) {
//           setRefilling(false);
//         }
//       }
//     }, refillTime / 100);

//     // Fetch count from Firestore when component mounts
//     if (telegramUserid) {
//       fetchCountFromFirestore(telegramUserid)
//         .then((userCount) => {
//           if (isNaN(userCount)) {
//             setCount(0);
//             updateCountInFirestore(telegramUserid, 0);
//           } else {
//             setCount(userCount);
//           }
//           setLoading(false); // Set loading to false after fetching count
//         })
//         .catch(() => {
//           setCount(0); // Set count to 0 if fetching fails
//           setLoading(false);
//         });
//     }



//     return () => clearInterval(interval);
//   }, [energy]);

//   useEffect(() => {
//     // Get count from local storage when component mounts
//     const storedCount = localStorage.getItem('count');
//     if (storedCount) {
//       setCount(parseInt(storedCount)); // Parse stored count as integer and set it in state
//     }
//   }, []);


//   const storeUserData = async (username, userid) => {
//     try {
//       await addDoc(collection(db, 'telegramUsers'), {
//         username: username,
//         userId: userid,
//         timestamp: new Date()
//       });
//       console.log('User data stored:', { username, userid });
//     } catch (e) {
//       console.error('Error adding document: ', e);
//     }
//   };


//   const updateCountInFirestore = async (userid, newCount) => {
//     try {
//       const userRef = collection(db, 'telegramUsers');
//       const querySnapshot = await getDocs(userRef);
//       querySnapshot.forEach((doc) => {
//         if (doc.data().userId === userid) {
//           updateDoc(doc.ref, { count: newCount });
//         }
//       });
//       console.log('Count updated:', newCount);
//     } catch (e) {
//       console.error('Error updating document: ', e);
//     }
//   };

//   const fetchCountFromFirestore = async (userid) => {
//     try {
//       const userRef = collection(db, 'telegramUsers');
//       const querySnapshot = await getDocs(userRef);
//       let userCount = 0;
//       querySnapshot.forEach((doc) => {
//         if (doc.data().userId === userid) {
//           userCount = doc.data().count;
//         }
//       });
//       return userCount;
//     } catch (e) {
//       console.error('Error fetching document: ', e);
//       return 0;
//     }
//   };

//   const storeUsername = async (username) => {
//     try {
//       await addDoc(collection(db, 'telegramUsers'), {
//         username: username,
//         timestamp: new Date()
//       });
//       console.log('Username stored:', username);
//     } catch (e) {
//       console.error('Error adding document: ', e);
//     }
//   };

//   const formattedCount = new Intl.NumberFormat().format(count).replace(/,/g, " ");

//   return (
//     <>

// {loading ? (
//         <Spinner />
//       ) : (

// <Animate>


//             <div className="flex space-x-[2px] justify-center items-center">
//               <div className="w-[50px] h-[50px]">
//                 <img src={coinsmall} className="w-full" alt="coin"/>
//               </div>
//               <h1 className="text-[#fff] text-[42px] font-extrabold">
//               {formattedCount}
//               </h1>
//             </div>
//             <div onClick={levelsAction} className="w-full ml-[6px] flex space-x-1 items-center justify-center">
//               <img src={bronze} className="w-[30px] h-[30px] relative" alt="bronze"/>
//               <h2 className="text-[#9d99a9] text-[20px] font-medium">Bronze</h2>
//               <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]"/>
//             </div>
//             <div className="w-full flex justify-center items-center pt-8 pb-36">
//               <div className="w-[300px] h-[300px] relative">
//                 <div className="bg-[#efc269] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] -left-40 rounded-full"></div>
               
//                 <div className="image-container" onClick={handleClick}>
//                   <Container>
//                     <img
//                       ref={imageRef}
//                       src={tapmecoin}
//                       alt="Wobble"
//                       className="wobble-image"
//                     />

//                     {clicks.map((click) => (
//                       <SlideUpText
//                         key={click.id}
//                         x={click.x}
//                         y={click.y}
//                       >
//                         +5
//                       </SlideUpText>
//                     ))}
//                   </Container>


//                 </div>




//               </div>
//             </div>

//             <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">

//                     <div className="flex flex-col w-full items-center justify-center">
//             <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
//     <IoIosFlash size={24} className="text-[#efc269]"/>
//     <div className="">
//       <span className="text-[18px] font-bold">{displayEnergy}</span>
//       <span className="text-[14px] font-medium">/ 500</span>
//     </div>
//   </div>

//     <div className="flex w-full p-[4px] items-center bg-[#473847] rounded-[10px] border-[1px] border-[#453e5a]">
//     <EnergyFill percentage={(energy / 500) * 100} />
//     </div>
//   </div>
//   </div>

//   <Levels showLevels={showLevels} setShowLevels={setShowLevels} />


       
//         </Animate>   
//         )}
      
//     </>
//   );
// }

// export default Appold;

