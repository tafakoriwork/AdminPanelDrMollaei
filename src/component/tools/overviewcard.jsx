import React from "react";

function OverviewCard(props) {
    const {icon, card, count} = props;
  return (
    <div className="overviewcard">
      <div className="overviewcard__icon">{icon}</div>
      <div className="overviewcard__icon">{count}</div>
      <div className="overviewcard__info">{card}</div>
    </div>
  );
}

export default OverviewCard;
