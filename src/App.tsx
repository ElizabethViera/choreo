import React from "react";
import logo from "./logo.svg";
import "./App.css";

const getPath = (name: string) => {
  return `/art-assets/${name}.png`;
};

const App: React.FC = () => {
  const [people, setPeople] = React.useState<
    Record<string, { posx: number; posy: number }>
  >({ bat: { posx: 50, posy: 50 }, bird: { posx: 150, posy: 300 } });

  const [selected, setSelected] = React.useState<string | null>(null);
  return (
    <Canvas
      icons={Object.keys(people).map(animal => ({
        iconType: getPath(animal),
        posx: people[animal].posx,
        posy: people[animal].posy,
        selected: animal === selected,
        onClick: () => {
          setSelected(animal);
        }
      }))}
      onClick={(x, y) => {
        console.log(x, y);
        if (selected) {
          setPeople({ ...people, [selected]: { posx: x, posy: y } });
          setSelected(null);
        }
      }}
    />
  );
};
type IconProps = {
  iconType: string;
  posx: number;
  posy: number;
  selected: boolean;
  onClick: () => void;
};
const Icon: React.FC<IconProps> = ({
  iconType,
  posx,
  posy,
  selected,
  onClick
}) => {
  return (
    <img
      onClick={e => {
        onClick();
        e.stopPropagation();
      }}
      style={{
        width: 80,
        height: 80,
        border: selected ? "4px solid pink" : "2px solid #DDD",
        borderRadius: 40,
        position: "absolute",
        left: posx-40,
        top: posy-40,
        boxSizing: "border-box"
      }}
      src={iconType}
    />
  );
};

const Canvas: React.FC<{
  icons: IconProps[];
  onClick: (x: number, y: number) => void;
}> = ({ icons, onClick }) => {
  return (
    <div
      style={{ height: 1000, width: 1000 }}
      onClick={e => {
        onClick(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      }}
    >
      {icons.map((icon, index) => (
        <Icon {...icon} key={index} />
      ))}
    </div>
  );
};

export default App;
