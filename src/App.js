import { useState, useEffect, useRef } from 'react';
import React from 'react';
import './App.css';
import ReactDOM from 'react-dom'
import {useTrail, animated, useTransition, useSpring, useChain, config, useSpringRef} from 'react-spring'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {store, useGlobalState} from 'state-pool';
import { isPropertySignature } from 'typescript';
import RadarChart from './components/RadarChart';
import CharStats from './components/CharStats';


// https://reactjs.org/docs/error-boundaries.html
//Class component for error handling because class components are useful when we have a requirement with the state of the component and its hard to do with a functional component
class ErrorBoundary extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStatefromError(error) {
      //Updates render so that the next render will show fallback UI
      return {hasError: true};
  }

  componentDidCatch(error, errorinfo) {
    //Error reporting service
    console.log(error, errorinfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1> Hey you did something wrong again </h1>
    }

    return this.props.children
  }
}

//Prevents default refresh of components, rather useful when needed
function handleSubmit(event) { 
  event.preventDefault();
}

//https://dev.to/yezyilomo/you-can-definitely-use-global-variables-to-manage-global-state-in-react-17l3 
// For global counter ( State - pool), global variables library 
store.setState("count",0);
store.setState("tasks",0);
store.setState("attacks",0);
store.setState("exp",10);
store.setState("workout",0);
store.setState("name",0);

//This function is for calculating and displaying user's level using experience points
function Experience(props) { 
  const [experience, setExp] = useGlobalState("exp"); //useGlobalState instead of useState to use the global variables declared just now
  let incrementExp = (e) => {
    setExp(experience+5) 
  }
  let level = Math.floor(experience)/10
  return(
    <div>
      <h2>Level:{level}</h2>
    </div>
  )
}

// Each successful monster gives 5 EXP. 
// It takes 10 EXP to get one level so EXP / 10 = Level



// Using a global variable that is incremented when a task is complete to display the total number of tasks the user has completed
// Displayed in the Analytics Page, but may be unnecessary. Code is here for testing purposes.
function TasksComplete(props) {
  const [task,setTask] = useGlobalState("tasks");
  const [workout, setWorkout] = useGlobalState("workout");
  let inrementTask = (e) => {
    setTask(task+1)
    setWorkout(workout+2)
  }
    return(
      <div>
        <h4> You have completed a total of {task} tasks! </h4>
        <br/>
      </div>
  )
}

// The function that displays how many attacks the user has in the Adventure Page 
function Attacks(props) {
  const [attack, setAttack] = useGlobalState("attacks");
  let incrementAttack = (e) => {
    setAttack(attack+2)
  }
    return(
      <div>
        <h4> You have {attack} attacks left! </h4>
        <br/>
      </div>
    )
}

// Same function as TaskComplete, used for testing purposes 
function CreateCounter(props) {
  const [count, setCount] = useGlobalState("count");

  let incrementCount = (e) => {
    setCount(count+1)
  }

  return (
    <div>
      <h4> You have completed a total of {count} tasks! </h4>
      <br/>
    </div>
  )
}


//https://blog.logrocket.com/building-inline-editable-ui-in-react/
//A directly editable username interface for the user 
// Component accept text, laceholder values and also pass what type of Input - 
// input, textarea so that we can use it for styling accordingly
const Editable = ({
  text,
  type,
  placeholder,
  children,
  ... props
}) => {

   // Manage the state whether to show the label or the input box. By default, label will be shown.
  const [isEditing, setEditing] = useState(false);
// Event handler while pressing any key while editing
  const handleKeyDown = (event, type) => {
    // Handle when key is pressed
  };

  /*
- It will display a label is `isEditing` is false
- It will display the children (input or textarea) if `isEditing` is true
- when input `onBlur`, we will set the default non edit mode
*/

return (
  <section {...props}>
    {isEditing ? (
      <div
        onBlur={() => setEditing(false)}
        onKeyDown={e => handleKeyDown(e, type)}
      >
        {children}
      </div>
    ) : (
      <div
        onClick={() => setEditing(true)}
      >
        <span>
          {text || placeholder || "Editable content"}
        </span>
      </div>
    )}
  </section>
);
};

function Username() {
  const [name, setName] = useGlobalState("name" );
  
  return (
    <Editable
    text={name}
    placeholder="Username"
    type="input"
  >
    <textarea
      type = "text"
      name = "name"
      placeholder = "Username"
      value ={name}
      onChange={e=> setName(e.target.value)} //Returns what the user has inputted into the text area as the new "username"
      />
  </Editable>
  ); 
}

//A function for creating new tasks, code idea from: Beta Version Java Web Development by Paul Baumgarten
function NewItemForm({onSubmit}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [count, setCount] = useGlobalState("count");
  const [workout, setWorkout] = useState(0);
  const [health, setHealth] = useState(0);
  const [study, setStudy] = useState(0);
  

    let incrementWork = (e) => {
      if (type === "Workout") {
      setWorkout(workout+1)
      }
    }

    let incrementHealth = (e) => {
      if (type === "Health") {
      setHealth(health+1)
      }
    }

    let incrementStudy = (e) => {
      if (type === "Study") {
      setStudy(study+1)
      }
    }

    let incrementCount = (e) => {
      setCount(count+1)
      setWorkout(workout-workout)
      setHealth(health-health)
      setStudy(study-study)
    }



// These are for incrementing the user's statistics through a CharStats Array imported from "CharStats.js"
// The lines below serve to update the array depending on which type of tasks the users create
    CharStats[0] = CharStats[0] + workout

    CharStats[1] = CharStats[1] + health

    CharStats[2] = CharStats[2] + study



  return(
      <div>
          <fieldset className="NewItem">
            <legend>Create a new item</legend>

            {/* This is the subject textbox */}
            <label htmlFor="subj"> - Subject</label>
            <input id="subj" value={subject} onChange={e=>{
              setSubject(e.target.value); //Input value for "subject"
            }}/>

            {/* This is the subject textbox */}
            <label htmlFor="desc"> - Description</label>
            <textarea id="desc" type="text" value={description} rows={5} onChange={e=>{
              setDescription(e.target.value); //Input value for "Description"
            }}/>

            {/* This is for the drop down menu for the type - I have to link this in with the character stats and the graph later . */}
            <label htmlFor="type"> - Type</label>
            <select name="type" onChange={e=>{
              setType(e.target.value); //This part of the code and below - Radio Buttons for type of task 

            }}>
              <option value="" selected>Type of Task</option>
              <option value="Workout"  >Workout</option>
              <option value="Health" >Health</option>
              <option value="Study" >Study</option>
            </select>

            {/*   This is the action button */}

            <label htmlFor="create"/>
            <button id="create" onClick={e=>{
              onSubmit( {subject:subject, description:description, type:type} );
              setSubject("");
              setDescription("");
              setType("");
              incrementCount();
              incrementWork();
              incrementHealth();
              incrementStudy();
             
            }} >Create item</button>
          </fieldset>
      </div>
  )
}

// This function is responsible for the information for each task that is displayed (Also responsible for completion/deletion of task button)
function ShowItem({key, item, onDelete}) {
  const [task, setTask] = useGlobalState("tasks");
  const [attack, setAttack] = useGlobalState("attacks");
  const [number, setNumber] = useState(0);

  let incrementNumber = (e) => {
    setNumber(number+1)
  }
  let incrementTask = (e) => {
    setTask(task+1)
  }

  let incrementAttack = (e) => {
    setAttack(attack+2)
  }

  CharStats[3] = (task+1)/((number+1)/2) // This is for calculating productivity.
  //  Calculates how many tasks are completed out of the tasks that were created and details it as a numerical value

  return(
    <div className="ShowItem">
      <div className="left"> - Subject</div>
      <div className="right">{item.subject}</div>
      <div className="left"> - Description</div>
      <div className="right">{item.description}</div>
      <div className="left"> - Type</div>
      <div className="right">{item.type}</div>
      <button className="Green" onClick={()=>{ incrementNumber(); onDelete(key); incrementTask(item.type); incrementAttack();}}> x</button>
    </div>
  )
}

//Deleting items using array splices and Mapping out the array to display to user
function ItemsList() {
  
  const [items, setItems] = useState([]);
  const addItem = (item) => {
    console.log("addItem received:", item);
    setItems([...items, item]);
  }

  const onDelete = (i) => {
    items.splice(i,1)
    setItems([...items]);
  }

  console.log(items);
  return(
    <h4>
    <div className="ItemsList">
      {
        items.map((val, i) =>{
          return(<ShowItem key={i} item={val} onDelete={onDelete}/> )
        })
      }
      <NewItemForm onSubmit={addItem}/>
    </div>
    </h4>
  )
}


// A small line used for representing magnitude of user stats 
function SmallLine() {
  return <h6 className="InLine">|</h6>
}

{/*
  The function above is the symbol to represent the numerical stat of that characteristic of the user 
  The function below is for calculating how many lines to display
*/}
// From CharStats Array, this function will declare arrays which will push a symbol "I" (Through function SmallLine above)
// for each position in the array, where the size of the array is determined by the magnitude of that user stat
// For example, CharStats[0] is responsible for user stat "workout", and its value will be responsible for the 
// length of rowsWorkout array and how many times "I" is printed for that stat
function CharList({onSubmit}) {
  const [workout, setWorkout] = useGlobalState("workout")
  const Currenttotal = CharStats[2]+CharStats[1]+CharStats[0];
    let rowsWorkout = []
    for (let i=0; i<(((CharStats[0])/Currenttotal)*100)/10; i++) {
      rowsWorkout.push(<SmallLine key={i} />)
    }
    let rowsHealth = []
    for (let i=0; i<(((CharStats[1])/Currenttotal)*100)/10; i++) {
      rowsHealth.push(<SmallLine key={i} />)
    }
    let rowsStudy = []
    for (let i=0; i<(((CharStats[2])/Currenttotal)*100)/10; i++) {
      rowsStudy.push(<SmallLine key={i} />)
    }
  

  return (

      <div className="NoPadding">
        {/* Displaying both the numerical stats of the user's but also displaying the "I" symbols, 
        details of which were calculated above */}
        <h6 className="Center"> Strengths and Weaknesses (Tasks)</h6>
        <h6>{"- Workout ["+ CharStats[0]+"]"}{rowsWorkout}</h6>
        <h6>{" - Health [" + CharStats[1]+"]"}{rowsHealth}</h6>
        <h6>{" - Study [" + CharStats[2]+"]"}{rowsStudy}</h6>

      </div>
  )
}

// Fixed footer with links that allows the user to navigate between different pages
function Footer() {
  return(
    <div className="Footer">
      
        <Link to='/system'>─ Profile  ─</Link>
        <Link to='/analytics'>─  Analytics  ─</Link>
        <Link to='/adventure'>─  Adventure  ─</Link>
    </div>
  )
}

// A nice welcome page before going in the app
function Intro() {
  return(
    <div className="Intro">
      <h4><Link to='/system'>- Welcome. Press to continue -</Link></h4>
    </div>
  )
}

// Named the SystemPage after the name of the product, this contains the Profile App 
//(The first page the user is taken to )
// Functions include error handling, a function that displays the user's level, editable username interface
// and the ItemsList is the Task List
// Footer at the bottom for navigating pages 
function SystemPage() {
  return (
    
    <div> 
    <h1> System</h1>
    
    <ErrorBoundary>
      <div className="username">
      <Experience/> 
      <Username/>
      </div> 

      <h2>  -  Daily Tasks  - </h2>
      <ItemsList />
      <h3> - - - </h3>
      <h2>  -  Quests  - </h2>
      <ItemsList />
      <h3> - - - </h3>
      <h3> - - - </h3>
            
    </ErrorBoundary>
    <Footer />
    </div>
  );
}

// This is the default page that welcomes the user 
function DefaultPage() {
  return(
    <div>
      <Intro />
    </div>
    
  )
}

// The analytics page where the user's stats can be seen, including a total tasks completed count 
function AnalyticsPage() {
  
  return(
    <div>
      <h1>Analytics</h1>
      <h2 className="MyStatistics">  -   - My Statistics  -  - </h2>
      <TasksComplete/>
      <CharList/>
      
      <RadarChart/>
      <h3> - - - </h3>
      <h3> - - - </h3> 
    
      <Footer />
    </div>
  )
}

// Declare An array of possible monster names from which a random monster name is taken out of for the user to fight
function NewMob() { 
  var word=["Goblin", "Slime","Skeleton", "Wraith", "Gargoyle", "Golem", "Orc", "Ghouls", "Blood-Starved Beast", "Dragon", "Elemental", "Demon"];
  var words=word[Math.floor(Math.random()*word.length)];
  return(
    <h6>{words}</h6>
  )
}
var word=["Goblin", "Slime","Skeleton", "Wraith", "Gargoyle", "Golem", "Orc", "Ghouls", "Blood-Starved Beast", "Dragon", "Elemental", "Demon"];
var words=word[Math.floor(Math.random()*word.length)];

//A function that declares an array of possible monster hp (heaelth points) from which a random one is selected 
// This function is also responsible for displaying the monster name, monster hp, 
// Decrementing the user's available attack count, decrementing the monster's hp and responsible for 
// Detecting when the monster is defeat and also correctly allocates experience to the user 

// The use of react hooks and global variable library state-pools allows for this function to serve many different
// purposes and functions
function RandomMonster(props, filename, callback) {
  // Monster Title and Description
  var hp =[1, 3, 5, 7, 10]
  var hps=hp[Math.floor(Math.random()*hp.length)];

  const [health, setHealth] = useState(hps);
  const [exps, setexp] = useGlobalState("exp");
  const [attack, setAttack] = useGlobalState("attacks");
  

    let incrementexp = (e) => {
      if (health < 0) {
        setexp(exps+5)
      }
    }

    let decrementhealth = (e) => {
      if (attack > 0) {
        setHealth(health-2)
      }
    }

  
    let decrementAttack = (e) => {
      if (attack > 0) {
        setAttack(attack-1)
      }
    
    }

    let incrementhealth = (e) => {
      setHealth(health+13)
    }
  
  return(
    <div> 
      {health > 0 && 
        <h2 className="Center" onClick={()=>{ decrementhealth(); decrementAttack(); }}><br/>{words}<br/> HP: {health} <br/> <br/> </h2>
      }

      {health < 0 &&
      <h2 onClick={() => {incrementexp(); incrementhealth(); }} >Congrats, you defeated the monster and earned 5 EXP! <br></br>Click again to collect! </h2>
      }

     

    </div>
  )
}


// Adventure Page where attacks available is listed, and where functions needed for this page are linked
function AdventurePage() {
  const [attack, setAttack] = useGlobalState("attacks");
  const [exps, setExp] = useGlobalState("exp");
  let incrementExp = (e) => {
    setExp(exps+5)
  }
  
  return(
    <div>
      <h1>Adventure</h1>
      <h6 className="Center" >The monster will run away if you leave, so kill it in one go!</h6>
      <h6 className="Center"> You have {attack} attacks left! </h6>
      <div className="Monsters"  >
       <RandomMonster />
      </div>
      <Footer />
    </div>
  )
}

// A function responsible for the navigation between different pages 
function App() {
  return(
    <div>
      <Router>
        <Routes>
          <Route exact path="/system" element={<SystemPage/>} />
          <Route path="*" element={<DefaultPage/>}/>
          <Route path="/analytics" element={<AnalyticsPage/>}/>
          <Route path="/adventure" element={<AdventurePage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
