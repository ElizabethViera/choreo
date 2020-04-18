import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import Button from "./components/Button";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import logo from "./logo.svg";
import "./App.css";

const useStyles = makeStyles(() => ({ root: {} }));

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
  const classes = useStyles();
  const [currentFormIndex, setCurrentFormIndex] = React.useState(0);
  const [formations, setFormation] = useLocalStorageState<FormationCoords[]>(
    [{}],
    "formations"
  );
  const [time, setTime] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (time == null) {
      return;
    }
    const timer = setTimeout(() => {
      setTime((time + 1) % formations.length);
    }, 1200);
    return () => {
      clearTimeout(timer);
    };
  }, [time, formations.length]);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>

          {/* Buttons for selecting frames */}

          <FormControl component="fieldset">
            <RadioGroup aria-label="position" name="position" value={currentFormIndex} onChange={(e) => setCurrentFormIndex(parseInt(e.target.value))} row>
              {formations.map((formation, index) => (
                <FormControlLabel
                  value={index}
                  control={<Radio color="secondary" />}
                  label={index}
                  labelPlacement="top"
                />
              ))}
            </RadioGroup>
          </FormControl>


        </Toolbar>
      </AppBar>

      <Button
        onClick={() => {
          if (time == null) {
            setTime(0);
          } else {
            setTime(null);
          }
        }}
      >
        {" "}
        Play/Pause{" "}
      </Button>
      <Button
        onClick={() => {
          const newFormations = formations.slice(0);
          newFormations.splice(
            currentFormIndex,
            0,
            formations[currentFormIndex]
          );
          setFormation(newFormations);
        }}
      >
        Create New Formation
      </Button>
      <Formation
        people={time == null ? formations[currentFormIndex] : formations[time]}
        setPeople={newPeople => {
          const formCopy = formations.slice(0);
          formCopy[currentFormIndex] = newPeople;
          setFormation(formCopy);
        }}
        prevPeople={time == null ? formations[currentFormIndex - 1] || {} : {}}
        nextPeople={time == null ? formations[currentFormIndex + 1] || {} : {}}
      />
      <div style={{ marginLeft: "20px", display: "flex", flexDirection: "row", alignItems: "stretch" }}>
        <textarea
          style={{ marginRight: "10px" }}
          value={JSON.stringify(formations)}
          onChange={e => {
            try {
              setFormation(JSON.parse(e.target.value));
            } catch {
            }
          }}
        />
        <Button
          onClick={() => {
            setCurrentFormIndex(0)
            setFormation([{}])
          }
          }>Clear Everything!</Button>
      </div>
    </div>
  );
};

const Formation: React.FC<{
  people: FormationCoords;
  setPeople: (people: FormationCoords) => void;
  nextPeople: FormationCoords;
  prevPeople: FormationCoords;
}> = ({ people, setPeople, nextPeople, prevPeople }) => {
  const [selectedPerson, setSelectedPerson] = React.useState<string | null>(
    null
  );
  const [selectState, setSelectState] = React.useState<{ name: string, mouseStart: Pos, personStart: Pos } | null>(
    null
  );
  const [showPrev, setShowPrev] = React.useState<boolean>(false)
  const [showNext, setShowNext] = React.useState<boolean>(false)
  console.log(showNext, nextPeople)
  return (
    <>
      <Button
        onClick={() => {
          if (Object.keys(people).length < iconTypes.length) {
            let new_icon_name = iconTypes[Object.keys(people).length];
            setPeople({ ...people, [new_icon_name]: { posx: 150, posy: 150 } });
          }
        }}
      >
        Add Person!
      </Button>
      <Button

        onClick={() => {
          setShowPrev(!showPrev)
        }}
      >
        Show/Hide Previous Formation
      </Button>
      <Button
        onClick={() => {
          setShowNext(!showNext)
        }}
      >
        Show/Hide Next Formation
      </Button>
      <Canvas
        onMouseMove={e => {
          if (selectState) {
            setPeople({
              ...people, [selectState.name]: snapToGrid({
                posx: e.pageX - selectState.mouseStart.posx + selectState.personStart.posx,
                posy: e.pageY - selectState.mouseStart.posy + selectState.personStart.posy,
              })
            });
          }
        }}
        onMouseUp={e => {
          if (selectState) {
            setPeople({
              ...people, [selectState.name]: snapToGrid({
                posx: e.pageX - selectState.mouseStart.posx + selectState.personStart.posx,
                posy: e.pageY - selectState.mouseStart.posy + selectState.personStart.posy,
              })
            });
            setSelectState(null);
          }
        }}
      >
        {showPrev && Object.keys(prevPeople).map(animal => (<Icon
          key={animal}
          iconType={getPath(animal)}
          posx={prevPeople[animal].posx}
          posy={prevPeople[animal].posy}
          opacity={0.4}
          color="#D5E0ED"
        />
        ))}
        {showNext && Object.keys(nextPeople).map(animal => (<Icon
          key={animal}
          iconType={getPath(animal)}
          posx={nextPeople[animal].posx}
          posy={nextPeople[animal].posy}
          opacity={0.4}
          color="#1CAFF0"
        />
        ))}
        {Object.keys(people).map(animal => (<Icon
          key={animal}
          iconType={getPath(animal)}
          posx={people[animal].posx}
          posy={people[animal].posy}
          selected={selectState !== null && animal === selectState.name}
          onMouseDown={(e) => {
            setSelectState({ name: animal, mouseStart: { posx: e.pageX, posy: e.pageY }, personStart: people[animal] });
          }}
        />
        ))}
      </Canvas>
    </>

  );
};

function snapToGrid(pos: Pos) {
  return {
    posx: Math.round(pos.posx / 50) * 50,
    posy: Math.round(pos.posy / 50) * 50
  }
}

type IconProps = {
  iconType: string;
  posx: number;
  posy: number;
  selected?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  opacity?: number;
  color?: string,
};
const Icon: React.FC<IconProps> = ({
  iconType,
  posx,
  posy,
  selected,
  onMouseDown,
  opacity = 1,
  color,
}) => {
  return (
    <img
      draggable={false}
      onMouseDown={e => {
        if (onMouseDown) {
          onMouseDown(e);
          e.stopPropagation();
        }
      }}
      style={{
        width: 80,
        height: 80,
        border: selected ? "4px solid #41C0AF" : "2px solid #DDD",
        borderRadius: 40,
        position: "absolute",
        left: posx - 40,
        top: posy - 40,
        boxSizing: "border-box",
        opacity,
        background: color,
      }}
      src={iconType}
    />
  );
};

const Canvas: React.FC<{
  children: React.ReactNode;
  onClick?: (x: number, y: number) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
}> = ({ children, onClick, onMouseUp, onMouseMove }) => {
  const divRef = React.useRef((null as any) as HTMLDivElement);
  return (
    <div
      ref={divRef}
      style={{ height: 1000, width: 1000, position: "relative" }}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onClick={e => {
        console.log(e.nativeEvent.clientX, e.nativeEvent.clientY, divRef.current.getBoundingClientRect())
        if (onClick) {
          onClick(
            e.nativeEvent.clientX - divRef.current.getBoundingClientRect().left,
            e.nativeEvent.clientY - divRef.current.getBoundingClientRect().top
          );
        }
      }}
    >
      {children}
    </div>
  );
};

export default App;
