import React from "react";
import cover1 from "../img/cover1.png";
import cover2 from "../img/cover2.png";
import cover3 from "../img/cover3.png";
import cover4 from "../img/cover4.png";
import icon from "../img/Hourglass.png";

const groups = [
    { id: 1, name: "모임 1", members: ["김은석", "김은서", "김은서", "김은서"], count: 4 },
    { id: 2, name: "모임 1", members: ["조희원", "조희원", "조희원"], count: 3 },
    { id: 3, name: "모임 1", members: ["주세은", "주세은", "주세은", "주세은", "주세은"], count: 5 },
    { id: 4, name: "모임 1", members: ["강효정", "강효정", "강효정", "강효정"], count: 4 }
  ];
  
  const covers = [cover1, cover2, cover3, cover4];

  const GroupList = () => {
    return (
      <section className="grouplist">
        <h2><img src={icon} alt="icon"></img> 정산 할 모임 목록</h2>
        <div>
        {groups.map((group) => (
            <div key={group.id} className="group-item">
                <div className="group-info">
                    <img src={covers[group.id - 1]} alt={`cover ${group.id}`} />
                    <div className="group-text">
                        <p>{group.name} ({group.count})</p>
                        <p>{group.members.join(", ")}</p>
                    </div>
                </div>
                <label className="switch">
                    <input type="checkbox" />
                    <span></span>
                </label>
            </div>
        ))}
        </div>
      </section>
    );
  };
  
  export default GroupList;
  