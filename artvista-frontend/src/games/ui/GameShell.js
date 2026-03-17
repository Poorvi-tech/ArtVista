import React from "react";

export default function GameShell({
  title,
  subtitle,
  right,
  children,
  footer,
}) {
  return (
    <div className="gameRoot">
      <div className="gameContainer">
        <div className="gameHeaderRow">
          <div style={{ minWidth: 260, flex: 1 }}>
            <h2 className="gameTitle">{title}</h2>
            {subtitle ? <p className="gameSubtitle">{subtitle}</p> : null}
          </div>
          {right ? <div className="gameToolbar">{right}</div> : null}
        </div>

        {children}

        {footer ? (
          <div style={{ marginTop: 16, color: "rgba(15, 23, 42, 0.55)" }}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

