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

//https://dev.to/yezyilomo/you-can-definitely-use-global-variables-to-manage-global-state-in-react-17l3 
// For global counter ( State - pool)
function handleSubmit(event) {
  event.preventDefault();
}

store.setState("count",0);
store.setState("tasks",0);
store.setState("attacks",0);
store.setState("exp",10);
store.setState("workout",0);
store.setState("name",0);


function Experience(props) { 
  const [experience, setExp] = useGlobalState("exp");
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
      onChange={e=> setName(e.target.value)}
      />
  </Editable>
  );
}

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
              setSubject(e.target.value);
            }}/>

            {/* This is the subject textbox */}
            <label htmlFor="desc"> - Description</label>
            <textarea id="desc" type="text" value={description} rows={5} onChange={e=>{
              setDescription(e.target.value);
            }}/>

            {/* This is for the drop down menu for the type - I have to link this in with the character stats and the graph later . */}
            <label htmlFor="type"> - Type</label>
            <select name="type" onChange={e=>{
              setType(e.target.value);

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

  CharStats[3] = (task+1)/((number+1)/2)

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

//Deleting items using array splices
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



function SmallLine() {
  return <h6 className="InLine">|</h6>
}

{/*
  The function above is the symbol to represent the numerical stat of that characteristic of the user 
  The function below is for calculating how mnay lines to display
*/}
function CharList({onSubmit}) {
  const [workout, setWorkout] = useGlobalState("workout")
  const Currenttotal = CharStats[3]+CharStats[2]+CharStats[1]+CharStats[0];
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
        {/* This is the stats list, and also prints symbols that represent stats out of overall profile */}
        <h6 className="Center"> Strengths and Weaknesses (Tasks)</h6>
        <h6>{"- Workout ["+ CharStats[0]+"]"}{rowsWorkout}</h6>
        <h6>{" - Health [" + CharStats[1]+"]"}{rowsHealth}</h6>
        <h6>{" - Study [" + CharStats[2]+"]"}{rowsStudy}</h6>

      </div>
  )
}


function Footer() {
  return(
    <div className="Footer">
      
        <Link to='/system'>─ Profile  ─</Link>
        <Link to='/analytics'>─  Analytics  ─</Link>
        <Link to='/adventure'>─  Adventure  ─</Link>
    </div>
  )
}

function Intro() {
  return(
    <div className="Intro">
      <h4><Link to='/system'>- Welcome. Press to continue -</Link></h4>
    </div>
  )
}


function SystemPage() {
  return (
    
    <div> 
    <h1> System</h1>
    
    <ErrorBoundary>
      <div className="username">
      <Experience/>
      <Username/>
      </div> 

          {/* <a href="https://google.com" target="_blank" rel="noopener">Open Google</a> {/* This part of the code allows for a button that links to a separate website */}
          {/* <audio src="minecraft.mp3" controls autoPlay loop></audio>  */}
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


function DefaultPage() {
  return(
    <div>
      <Intro />
    </div>
    
  )
}


function AnalyticsPage() {
  
  return(
    <div>
      <h1>Analytics</h1>
      <h2 className="MyStatistics">  -   - My Statistics  -  - </h2>
      <TasksComplete/>
      <CharList/>
      
      
      {/* for the line graph 
      for i from 0 to Table[0].length-1
        for j from 0 to Table.length-1, return or print Table[j][i]
      */}
      {/* <div class="container">
        <div class="container__progress" style="width: 40%;">40%
        </div>
      </div>
    */}
      <RadarChart/>
      <h3> - - - </h3>
      <h3> - - - </h3> 
    
      <Footer />
    </div>
  )
}

//Since putting it in the function made it refresh
function NewMob() { 
  var word=["Goblin", "Slime","Skeleton", "Wraith", "Gargoyle", "Golem", "Orc", "Ghouls", "Blood-Starved Beast", "Dragon", "Elemental", "Demon"];
  var words=word[Math.floor(Math.random()*word.length)];
  return(
    <h6>{words}</h6>
  )
}

var word=["Goblin", "Slime","Skeleton", "Wraith", "Gargoyle", "Golem", "Orc", "Ghouls", "Blood-Starved Beast", "Dragon", "Elemental", "Demon"];
var words=word[Math.floor(Math.random()*word.length)];

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
