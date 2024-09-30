import React from "react";
import ref from "../images/ref.webp";
import boost from "../images/boost.webp";
import tasks from "../images/tasks.webp";
import stats from "../images/stats.webp";
import coinsmall from "../images/coinsmall.webp";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex items-center justify-center w-full space-x-2">
      <NavLink
        to="/ref"
        className={({ isActive }) => {
          return `

${
  isActive
    ? "w-[20%] h-[65px] pt-1 bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
    : "w-[20%] h-[65px] pt-1 bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
}
    `;
        }}
      >
        <img src={ref} className="w-[32px] -mb-1" alt="ref" />
        <span className="font-medium">Frens</span>
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) => {
          return `

${
  isActive
    ? "w-[20%] h-[65px] pt-1 bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
    : "w-[20%] h-[65px] pt-1 bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
}
    `;
        }}
      >
        <img src={tasks} className="w-[30px]" alt="tasks" />
        <span className="font-medium">Tasks</span>
      </NavLink>

      {/*  */}

      <NavLink
        to="/"
        className={({ isActive }) => {
          return `

${
  isActive
    ? "w-[20%] h-[65px] pt-1 bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
    : "w-[20%] h-[65px] pt-1 bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
}
    `;
        }}
      >
        <img src={coinsmall} className="w-[30px] -mb-[1px]" alt="tap" />
        <span className="font-medium">Earn</span>
      </NavLink>
      <NavLink
        to="/boost"
        className={({ isActive }) => {
          return `

${
  isActive
    ? "w-[20%] h-[65px] pt-[8px] bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
    : "w-[20%] h-[65px] pt-[8px] bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
}
    `;
        }}
      >
        <img src={boost} className="w-[28px] -mb-[2px]" alt="boost" />
        <span className="font-medium">Boost</span>
      </NavLink>

      {/*  */}

      <NavLink
        to="/stats"
        className={({ isActive }) => {
          return `

${
  isActive
    ? "w-[20%] h-[65px] pt-[8px] bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
    : "w-[20%] h-[65px] pt-[8px] bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
}
    `;
        }}
      >
        <img src={stats} className="w-[24px]" alt="stats" />
        <span className="font-medium">Stats</span>
      </NavLink>
    </div>
  );
};

export default Footer;
