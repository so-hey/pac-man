export default function PacMan() {
  return (
    <div className="pacman">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15px"
        height="16px"
        viewBox="0 0 15 15"
        version="1.1"
      >
        <g id="surface1">
          <path
            style={{
              stroke: "none",
              fill: "yellow",
              fillOpacity: 1,
            }}
            d="M 14.820312 10.832031 C 13.199219 13.890625 9.578125 15.492188 6.066406 14.699219 C 2.558594 13.902344 0.0898438 10.921875 0.0976562 7.5 C 0.109375 4.074219 2.601562 1.109375 6.113281 0.332031 C 9.625 -0.441406 13.238281 1.179688 14.839844 4.25 L 7.875 7.519531 Z M 14.820312 10.832031 "
          />
        </g>
      </svg>
    </div>
  );
}
