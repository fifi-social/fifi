import React, { useEffect, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import coinsmall from "../images/coinsmall.webp";
import taskbook from "../images/taskbook.webp";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Spinner from "../Components/Spinner";
import TaskOne from "../Components/TaskOne";
import ClaimLeveler from "../Components/ClaimLeveler";
import Levels from "../Components/Levels";
import { IoCheckmarkSharp } from "react-icons/io5";
// import TaskTwo from '../Components/TaskTwo';
import congrats from "../images/celebrate.gif";
import { useUser } from "../context/userContext";
import MilestoneRewards from "../Components/MilestoneRewards";
import ReferralRewards from "../Components/Rewards";
import TaskTelegram from "../Components/Task/TaskTelegram";
import TaskTw from "../Components/Task/TaskTw";

const Tasks = () => {
  const {
    id,
    balance,
    refBonus,
    taskCompleted,
    level,
    setTaskCompleted,
    taskCompleted2,
    setTaskCompleted2,
  } = useUser();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [showTaskTelegram, setShowTaskTelegram] = useState(false);
  const [showTaskTw, setShowTaskTw] = useState(false);
  // eslint-disable-next-line
  const [claimLevel, setClaimLevel] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  const taskID = "task_tele_1"; // Assign a unique ID to this task
  const taskID2 = "task_tw_1"; // Assign a unique ID to this task

  const [activeIndex, setActiveIndex] = useState(1);

  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  const taskTelegram = () => {
    setShowTaskTelegram(true);
    document.getElementById("footermain").style.zIndex = "50";
  };

  const taskTw = () => {
    setShowTaskTw(true);
    document.getElementById("footermain").style.zIndex = "50";
  };

  useEffect(() => {
    checkTaskCompletion(id, taskID).then((completed) => {
      setTaskCompleted(completed);
      if (completed) {
        setMessage("");
      }
    });
    checkTaskCompletion(id, taskID2).then((completed) => {
      setTaskCompleted2(completed);
      if (completed) {
        setMessage("");
      }
    });

    console.log("my userid is:", id);

    // eslint-disable-next-line
  }, []);

  const checkTaskCompletion = async (id, taskId, taskId2) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${id}_${taskId}`);
      const userTaskDocRef2 = doc(db, "userTasks", `${id}_${taskId2}`);
      const docSnap = await getDoc(userTaskDocRef, userTaskDocRef2);
      if (docSnap.exists()) {
        return docSnap.data().completed;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Error checking task completion: ", e);
      return false;
    }
  };

  const levelsAction = () => {
    setShowLevels(true);

    document.getElementById("footermain").style.zIndex = "50";
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
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <div className="flex-col justify-center w-full px-5 space-y-3">
            <div className="fixed top-0 left-0 right-0 px-5 pt-8">
              <div className="relative flex items-center justify-center space-x-2">
                <div
                  id="congrat"
                  className="opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all"
                >
                  <img src={congrats} alt="congrats" className="w-full" />
                </div>
                {/* <Congratulations showCongrats={showCongrats} setShowCongrats={setShowCongrats} /> */}
                <div className="w-[50px] h-[50px]">
                  <img src={coinsmall} className="w-full" alt="coin" />
                </div>
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                  {formatNumber(balance + refBonus)}
                </h1>
              </div>
              {/* <div className="flex items-center justify-center w-full space-x-1">
              <img src={bronze} className="w-[30px] h-[30px] relative" alt="bronze"/>
              <h2 className="text-[#9d99a9] text-[20px] font-medium">Wood</h2>
              <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]"/>
            </div> */}

              <div
                onClick={levelsAction}
                className="w-full flex ml-[6px] space-x-1 items-center justify-center"
              >
                <img
                  src={level.imgUrl}
                  className="w-[25px] relative"
                  alt="bronze"
                />
                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                  {level.name}
                </h2>
                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
              </div>

              <div className="bg-borders w-full px-5 h-[1px] !mt-5 !mb-5"></div>

              <div className="w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center">
                <div
                  onClick={() => handleMenu(1)}
                  className={`${
                    activeIndex === 1 ? "bg-cards" : ""
                  }  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}
                >
                  Special
                </div>

                <div
                  onClick={() => handleMenu(2)}
                  className={`${
                    activeIndex === 2 ? "bg-cards" : ""
                  }  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}
                >
                  Leagues
                </div>

                <div
                  onClick={() => handleMenu(3)}
                  className={`${
                    activeIndex === 3 ? "bg-cards" : ""
                  }  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}
                >
                  Ref Tasks
                </div>
              </div>
            </div>

            <div className="!mt-[204px] w-full h-[60vh] flex flex-col">
              <div
                className={`${
                  activeIndex === 1 ? "flex" : "hidden"
                } alltaskscontainer flex-col w-full space-y-2`}
              >
                <div
                  onClick={taskTelegram}
                  className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center"
                >
                  <div className="flex items-center flex-1 space-x-2">
                    <div className="">
                      <img src={taskbook} alt="tasks" className="w-[50px]" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">Join my Telegram Channel</span>
                      <div className="flex items-center space-x-1">
                        <span className="w-[20px] h-[20px]">
                          <img src={coinsmall} className="w-full" alt="coin" />
                        </span>
                        <span className="font-medium">50 000</span>
                      </div>
                    </div>
                  </div>

                  {/*  */}

                  <div className="">
                    {taskCompleted ? (
                      <>
                        <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                      </>
                    ) : (
                      <>
                        <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                      </>
                    )}
                  </div>
                </div>
                {/* tw */}
                <div
                  onClick={taskTw}
                  className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center"
                >
                  <div className="flex items-center flex-1 space-x-2">
                    <div className="">
                      <img src={taskbook} alt="tasks" className="w-[50px]" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">Follow us on x.com</span>
                      <div className="flex items-center space-x-1">
                        <span className="w-[20px] h-[20px]">
                          <img src={coinsmall} className="w-full" alt="coin" />
                        </span>
                        <span className="font-medium">50 000</span>
                      </div>
                    </div>
                  </div>

                  {/*  */}

                  <div className="">
                    {taskCompleted ? (
                      <>
                        <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                      </>
                    ) : (
                      <>
                        <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                      </>
                    )}
                  </div>
                </div>

                {/*  */}
              </div>

              {/*  */}

              <div
                className={`${
                  activeIndex === 2 ? "flex" : "hidden"
                } alltaskscontainer flex-col w-full space-y-2`}
              >
                <MilestoneRewards />
              </div>

              {/*  */}

              <div
                className={`${
                  activeIndex === 3 ? "flex" : "hidden"
                } alltaskscontainer flex-col w-full space-y-2`}
              >
                <ReferralRewards />
              </div>
            </div>

            <TaskTelegram
              showModal={showTaskTelegram}
              setShowModal={setShowTaskTelegram}
            />
            <TaskTw showModal={showTaskTw} setShowModal={setShowTaskTw} />

            <ClaimLeveler
              claimLevel={claimLevel}
              setClaimLevel={setClaimLevel}
            />
            <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
          </div>
          <Outlet />
        </Animate>
      )}
    </>
  );
};

export default Tasks;
