import React from "react";
import logo from "./logo.svg";
import "./App.css";

const iconTypes = [
  "bat",
  "bird",
  "boat",
  "cat",
  "elephant",
  "frog",
  "plane",
  "rhino"
];

const getPath = (name: string) => {
  return `/art-assets/${name}.png`;
};

function useLocalStorageState<T>(
  initial: T,
  name: string
): [T, (newValue: T) => void] {
  const item = window.localStorage.getItem(name);
  const [state, setState] = React.useState<T>(
    item ? JSON.parse(item) : initial
  );
  return [
    state,
    newValue => {
      setState(newValue);
      window.localStorage.setItem(name, JSON.stringify(newValue));
    }
  ];
}

type Pos = { posx: number; posy: number };
type FormationCoords = Record<string, Pos>;

const App: React.FC = () => {
  const [currentFormIndex, setCurrentFormIndex] = React.useState(0);
  const [formations, setFormation] = React.useState<FormationCoords[]>([
    {},
    {},
    {}
  ]);
  return (
    <>
      {formations.map((formation, index) => (
        <button onClick={()=>{
          setCurrentFormIndex(index)
        }} key={index}>{index}</button>
      ))}
      <Formation
        people={formations[currentFormIndex]}
        setPeople={newPeople => {
          const formCopy = formations.slice(0);
          formCopy[currentFormIndex] = newPeople;
          setFormation(formCopy);
        }}
      />
    </>
  );
};

const Formation: React.FC<{
  people: FormationCoords;
  setPeople: (people: FormationCoords) => void;
}> = ({ people, setPeople }) => {
  const [selectedPerson, setSelectedPerson] = React.useState<string | null>(
    null
  );
  return (
    <>
      <button
        onClick={() => {
          if (Object.keys(people).length < iconTypes.length) {
            let new_icon_name = iconTypes[Object.keys(people).length];
            setPeople({ ...people, [new_icon_name]: { posx: 150, posy: 150 } });
          }
        }}
      >
        Add Person!
      </button>
      <Canvas
        icons={Object.keys(people).map(animal => ({
          iconType: getPath(animal),
          posx: people[animal].posx,
          posy: people[animal].posy,
          selected: animal === selectedPerson,
          onClick: () => {
            setSelectedPerson(animal);
          }
        }))}
        onClick={(x, y) => {
          console.log(x, y);
          if (selectedPerson) {
            setPeople({ ...people, [selectedPerson]: { posx: x, posy: y } });
            setSelectedPerson(null);
          }
        }}
      />
    </>
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
        left: posx - 40,
        top: posy - 40,
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
