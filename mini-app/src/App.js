// import React, { useState, useEffect, useRef, useContext } from "react";
// import styled, { keyframes } from "styled-components";
// import "./App.css";
// import coinsmall from "../src/images/coinsmall.webp";
// import tapmecoin from "../src/images/tapme1.webp";
// import bronze from "../src/images/bronze.webp";
// import { MdOutlineKeyboardArrowRight } from "react-icons/md";
// import { db } from "./firebase";
// import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
// import Animate from "./Components/Animate";
// import Spinner from "./Components/Spinner";
// import Levels from "./Components/Levels";
// import flash from "../src/images/flash.webp";
// import { EnergyContext } from "./context/EnergyContext";

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
//   height: 12px;
//   border-radius: 6px;
//   width: ${({ percentage }) => percentage}%;
// `;

// function App() {
//   const { energy, setEnergy, displayEnergy, setDisplayEnergy, idme, setIdme, count, setCount } = useContext(EnergyContext);
//     // eslint-disable-next-line
//   const [username, setUsername] = useState("");
//     // eslint-disable-next-line
//   const [name, setName] = useState("");
//   const imageRef = useRef(null);
//   const [clicks, setClicks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showLevels, setShowLevels] = useState(false);

//   const levelsAction = () => {
//     setShowLevels(true);
//     document.getElementById("footermain").style.zIndex = "50";
//   };

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
//       }, 500); // duration should match the animation duration in CSS

//       // Increment the count
//       const rect = e.target.getBoundingClientRect();
//       const newClick = {
//         id: Date.now(), // Unique identifier
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top,
//       };

//       const updatedCount = count + 2; // Increment count by 5
//       const updatedEnergy = energy - 2;

//       setClicks((prevClicks) => [...prevClicks, newClick]);
//       setCount(updatedCount);
//       setEnergy(updatedEnergy);
//       setDisplayEnergy(updatedEnergy); // Update display energy

//       updateUserStatsInFirestore(idme, updatedCount, updatedEnergy);

//       // Remove the click after the animation duration
//       setTimeout(() => {
//         setClicks((prevClicks) =>
//           prevClicks.filter((click) => click.id !== newClick.id)
//         );
//       }, 1000); // Match this duration with the animation duration
//     }
//   };

//   useEffect(() => {
//     // Fetch username and user ID from Telegram Web App context
//     const telegramName =
//       window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
//     const telegramLastName =
//       window.Telegram.WebApp.initDataUnsafe?.user?.last_name;
//     const telegramUsername =
//       window.Telegram.WebApp.initDataUnsafe?.user?.username;
//     const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

//     if (telegramName) {
//       setName(telegramName + " " + telegramLastName);
//     }

//     if (telegramUsername) {
//       setUsername(telegramUsername);
//     }
//     if (telegramUserid) {
//       setIdme(telegramUserid);
//     }

//     if (telegramUsername && telegramUserid) {
//       saveRefereeIdToFirestore();
//     }

//     // Fetch count and energy from Firestore when component mounts
//     if (telegramUserid) {
//       fetchUserStatsFromFirestore(telegramUserid)
//         .then((userStats) => {
//           if (isNaN(userStats.count)) {
//             setCount(0);
//             updateUserStatsInFirestore(telegramUserid, 0, 500);
//           } else {
//             setCount(userStats.count);
//             setEnergy(userStats.energy);
//             setDisplayEnergy(userStats.energy); // Update display energy
//           }
//           setLoading(false); // Set loading to false after fetching count
//         })
//         .catch(() => {
//           setCount(0); // Set count to 0 if fetching fails
//           setEnergy(500); // Set energy to 500 if fetching fails
//           setLoading(false);
//         });
//     }
//     // eslint-disable-next-line
//   }, []);

//   const saveRefereeIdToFirestore = async () => {
//     // Fetch username and user ID from Telegram Web App context
//     const telegramUsername =
//       window.Telegram.WebApp.initDataUnsafe?.user?.username;
//     const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;
//     const telegramName =
//       window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
//     const telegramLastName =
//       window.Telegram.WebApp.initDataUnsafe?.user?.last_name;

//     const fullName = telegramName + " " + telegramLastName;

//     const queryParams = new URLSearchParams(window.location.search);
//     let refereeId = queryParams.get("ref");
//     if (refereeId) {
//       // Remove all non-numeric characters
//       refereeId = refereeId.replace(/\D/g, "");
//     }

//     if (telegramUsername && telegramUserid) {
      
//       await storeUserData(
//         fullName,
//         telegramUsername,
//         telegramUserid,
//         refereeId
//       );
//     }
//   };

//   const storeUserData = async (fullname, username, userid, refereeId) => {
//     try {
//       const finalUsername = username || `Anonymous_${userid}`;
//       const userRef = collection(db, "telegramUsers");
//       const querySnapshot = await getDocs(userRef);
//       let userExists = false;

//       querySnapshot.forEach((doc) => {
//         if (doc.data().userId === userid) {
//           userExists = true;
//         }
//       });

//       if (!userExists) {
//         await addDoc(userRef, {
//           fullname: fullname,
//           username: finalUsername,
//           userId: userid,
//           count: 0, // Initialize count
//           energy: 500, // Initialize energy
//           refereeId: refereeId || null, // Store refereeId if present
//           timestamp: new Date(),
//         });
//         // console.log("User data stored:", { username, userid, refereeId });
//       } else {
//         // console.log("User already exists:", { username, userid });
//       }
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   };

//   const updateUserStatsInFirestore = async (userid, newCount, newEnergy) => {
//     try {
//       const userRef = collection(db, "telegramUsers");
//       const querySnapshot = await getDocs(userRef);
//       querySnapshot.forEach((doc) => {
//         if (doc.data().userId === userid) {
//           updateDoc(doc.ref, { count: newCount, energy: newEnergy });
//         }
//       });
//       // console.log("User stats updated:", { newCount, newEnergy });
//     } catch (e) {
//       console.error("Error updating document: ", e);
//     }
//   };

//   const fetchUserStatsFromFirestore = async (userid) => {
//     try {
//       const userRef = collection(db, "telegramUsers");
//       const querySnapshot = await getDocs(userRef);
//       let userStats = { count: 0, energy: 500 };
//       querySnapshot.forEach((doc) => {
//         if (doc.data().userId === userid) {
//           userStats = { count: doc.data().count, energy: doc.data().energy };
//         }
//       });
//       return userStats;
//     } catch (e) {
//       console.error("Error fetching document: ", e);
//       return { count: 0, energy: 500 };
//     }
//   };

//   const formattedCount = new Intl.NumberFormat()
//     .format(count)
//     .replace(/,/g, " ");

//   return (
//     <>
    
//       {loading ? (
//         <Spinner />
//       ) : (
//         <Animate>
//           <div className="flex space-x-[2px] justify-center items-center">
//             <div className="w-[50px] h-[50px]">
//               <img src={coinsmall} className="w-full" alt="coin" />
//             </div>
//             <h1 className="text-[#fff] text-[42px] font-extrabold">
//               {formattedCount}
//             </h1>
//           </div>
//           <div
           
//             className="w-full ml-[6px] flex space-x-1 items-center justify-center"
//           >
//             <img
//               src={bronze}
//               className="w-[30px] h-[30px] relative"
//               alt="bronze"
//             />
//             <h2 onClick={levelsAction} className="text-[#9d99a9] text-[20px] font-medium">Bronze</h2>
//             <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
//           </div>
//           <div className="w-full flex justify-center items-center pt-14 pb-36">
//             <div className="w-[265px] h-[265px] relative">
//               <div className="bg-[#efc26999] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] -left-40 rounded-full"></div>
//               <div className="image-container">
//                 <Container>
//                   <img
//                     onPointerDown={handleClick}
//                     ref={imageRef}
//                     src={tapmecoin}
//                     alt="Wobble"
//                     className="wobble-image select-none"
//                   />
//                   {clicks.map((click) => (
//                     <SlideUpText key={click.id} x={click.x} y={click.y}>
//                       +2
//                     </SlideUpText>
//                   ))}
//                 </Container>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">
//             <div className="flex flex-col w-full items-center justify-center">
//               <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
//                 <img alt="flash" src={flash} className="w-[20px]" />
//                 <div className="">
//                   <span className="text-[18px] font-bold">{displayEnergy}</span>
//                   <span className="text-[14px] font-medium">/ 500</span>
//                 </div>
//               </div>
//               <div className="flex w-full p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders2">
//                 <EnergyFill percentage={(energy / 500) * 100} />
//               </div>
//             </div>
//           </div>
//           <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
//         </Animate>
//       )}
//     </>
//   );
// }

// export default App;

    // apiKey: "AIzaSyCt3bK1eERJpsmJrNNDsLNdlHP7fwbN1bQ",
    // authDomain: "plutosmain-2e5d5.firebaseapp.com",
    // projectId: "plutosmain-2e5d5",
    // storageBucket: "plutosmain-2e5d5.appspot.com",
    // messagingSenderId: "381021131691",
    // appId: "1:381021131691:web:fbf1fabc9fb5046868f8ee",
    // measurementId: "G-HPKW1B37V6"
